import * as gulp from 'gulp';
import * as path from 'path';
import * as fs from 'fs';
import {BuildToolsFactory} from './BuildToolsFactory';

import {BaseTools} from './BaseTools';
var chokidar = require('chokidar');
import {SbtModule} from '../types/SbtModule';

import * as ts from "typescript";

import {TsSourceFile} from '../types/TsSourceFile';

export class BuildTools extends BaseTools {

   private _moduleName: string;
   private _isCompling: boolean;

   private _dest: string;
   protected _tsComplieOptions: ts.CompilerOptions;
   private _isDepModule: boolean;

   private _factory: BuildToolsFactory;
   private _quickMode: boolean;

   public enableQuickMode() {
      this._quickMode = true;
   }

   public disableQuickMode() {
      this._quickMode = false;
   }

   public sbtModule: SbtModule

   constructor(moduleName: string,
      configFiles?: Array<string>,
      tsComplieOptions?: any,
      isDepModule?: boolean
   ) {
      super(configFiles);
      if (moduleName.indexOf('.ts') > -1) {
         this.initFiles(moduleName)
      } else {
         this.init(moduleName, configFiles, tsComplieOptions, isDepModule)
      }
   }

   public initFiles(files: string) {
      this._quickMode = true;
      this._needComplieFiles = files.split(' ');
      console.log(this._needComplieFiles)
   }

   public init(moduleName: string,
      configFiles?: Array<string>,
      tsComplieOptions?: any,
      isDepModule?: boolean) {
      this._moduleName = moduleName;
      this._tsComplieOptions = tsComplieOptions;
      this._isCompling = false;
      this._isDepModule = isDepModule;
      this._factory = new BuildToolsFactory();

      this.sbtModule = new SbtModule(this.getModuleConfig(moduleName));
   }


   public getThisModuleConfig() {
      var moduleName = this.getModuleName();
      return this.getModuleConfig(moduleName)
   }

   public getModuleName() {
      return this._moduleName;
   }

   public getBuildDest() {
      return this._dest || path.join('build')
   }

   public setBuildDest(dest: string) {
      this._dest = dest;
   }


   public watchFilesAndBuild() {
      var dir = this.getModulePath(this.getModuleName())
      console.log('watching ' + dir);
      var build = (msg, printMsg?: boolean) => {
         console.log(msg);
         this.build();
      }
      var watcher = chokidar.watch(dir, { ignored: /^\./, persistent: true });
      this.sbtModule.isWatching = true;
      watcher
         .on('add', (file) => {
            this.sbtModule.updateModifyTime();
            this.addFileToNextComplie(file);
            if (file.indexOf('_ref') > -1) {
               this.sbtModule.addRef(file);
            }
            if (!this.firstBuild && this.firstBuildFinish) {
               build(file + ' added!');
            }
         })
         .on('change', (file) => {
            this.sbtModule.updateModifyTime();
            // if(path.basename(filepath).indexOf('module.js')> -1){
            //    console.log(filepath + ' updated!');
            // }else{
            this.addFileToNextComplie(file)
            build(file + ' changed!');
            //}
         })
         .on('unlink', (filepath) => {
            this.sbtModule.updateModifyTime();
            build(filepath + ' unlink!', true);
         })
         .on('error', function (error) { console.error('Error happened', error); })
         .on('ready', () => {
            build('watcher scan ready, start build ' + this.getModuleName() + '...');
         })
   }

   private _needComplieFiles = [];
   private addFileToNextComplie(file) {
      if (TsSourceFile.isTsSourceFile(file) && this._needComplieFiles.indexOf(file) == -1) {
         this._needComplieFiles.push(file)
      }
   }
   private clearNeedComplieFiles() {
      this._needComplieFiles = [];
   }

   public getNeedComplieFiles() {
      if (this._needComplieFiles.length > 0) {
         return this._needComplieFiles;
      }
   }

   public getAllProjectFiles() {
      return this.sbtModule.getAllTsFiles();
   }

   private firstBuild: boolean = true;
   private firstBuildFinish: boolean = false;

   public build(callback?: Function) {
      // tsc([
      //     '--p',
      //     dir
      // ],callback)
      //var tsconfig = path.join(this.getModulePath(this.getModuleName()), 'tsconfig.json');

      if (!this._isCompling && this.sbtModule.isDirty()) {
         this._isCompling = true;
         var build = (callback?: Function) => {
            if (!this.firstBuild) {
               this.firstBuildFinish = true;
               this.firstBuild = false;
            }
            this.buildDeps();
            this.complie();
            if (callback) callback();
         }
         setTimeout(build, 10)
      }
   }

   public prepareComplieOptions() {
      this._tsComplieOptions = {
         target: ts.ScriptTarget.ES5,
         module: ts.ModuleKind.CommonJS,
         allowJs: true,
         noImplicitAny: false,
         removeComments: false,
         noLib: false,
         preserveConstEnums: true,
         suppressImplicitAnyIndexErrors: true,
         emitDecoratorMetadata: true,
         experimentalDecorators: true,
         sourceMap: true,
         outDir: './build',
         jsx: ts.JsxEmit.React
      }
      var moduleConfig = this.getThisModuleConfig();
      if (moduleConfig.loaderType == 'amd') {
         this._tsComplieOptions.module = ts.ModuleKind.AMD;
      }
   }

   public complie() {
      var startBuildTime = new Date().getTime();
      if (!this._tsComplieOptions) {
         this.prepareComplieOptions();
      }

      this._isCompling = true;
      var files = [];

      if (this._quickMode) {
         files = this.getNeedComplieFiles();
      } else {
         files = this.getAllProjectFiles();
      }

      console.log('start build ' + this.getModuleName() + ', with ' + files.length + ' files... ');
      var refs = this.sbtModule.getRefs();
      for (var i in refs) {
         var ref = refs[i];
         if (files.indexOf(ref) == -1) {
            files.push(ref);
         }
      }

      if (this.isDebugModeEnabled()) {
         console.log(files.sort());
      }

      let program = ts.createProgram(files, this._tsComplieOptions || {
         noEmitOnError: true, noImplicitAny: true,
         target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS,
         sourceMap: true, sourceRoot: ''
      });
      let emitResult = program.emit();

      let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

      allDiagnostics.forEach(diagnostic => {
         let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
         let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
         console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      });

      this.clearNeedComplieFiles();
      this._isCompling = false;
      var endBuildTime = new Date().getTime();
      console.log('build ' + this.getModuleName() + ' finish, time cost: ', endBuildTime - startBuildTime);
   }

   public buildDeps() {
      var config = this.getModuleConfig(this.getModuleName());
      for (var i in config.deps) {
         var dep = config.deps[i];
         var buildTools = this._factory.createBuildTools(dep, this.getAllConfigFiles(),
            this._tsComplieOptions, true
         );
         buildTools.setBuildDest(this.getBuildDest())
         if (!buildTools.sbtModule.isWatching) {
            buildTools.watchFilesAndBuild();
         }
      }
   }
}

