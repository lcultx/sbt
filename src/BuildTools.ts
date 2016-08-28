import {tsc} from './lib/tsc';
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as path from 'path';
import * as fs from 'fs';
var sourcemaps = require('gulp-sourcemaps');
import {BuildToolsFactory} from './BuildToolsFactory';
var gcallback = require('gulp-callback');

import {BaseTools} from './BaseTools';
var chokidar = require('chokidar');
import {SbtModule} from './SbtModule';

export class BuildTools extends BaseTools {

   private _moduleName: string;
   private _isCompling: boolean;

   private _dest: string;
   private _tsComplieOptions: any;
   private _isDepModule:boolean;

   private _factory:BuildToolsFactory;

   public sbtModule:SbtModule

   constructor(moduleName: string,
      configFiles?: Array<string>,
      tsComplieOptions?:any,
      isDepModule?:boolean
   ) {
      super(configFiles);
      this._moduleName = moduleName;
      this._tsComplieOptions = tsComplieOptions;
      this._isCompling = false;
      this._isDepModule = isDepModule;
      this._factory = new BuildToolsFactory();

      this.sbtModule = new SbtModule(this.getModuleConfig(moduleName));
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
         if (printMsg) {
            console.log(this.getModuleName() + ' build watcher get file change event:');
            console.log(msg);
         }
         this.build();
      }
      var watcher = chokidar.watch(dir, { ignored: /^\./, persistent: true });
      this.sbtModule.isWatching = true;
      watcher
         .on('add',  (filepath)=> {
            this.sbtModule.updateModifyTime();
            build(filepath + ' added!', false);
         })
         .on('change', (filepath) => {
            this.sbtModule.updateModifyTime();
            // if(path.basename(filepath).indexOf('module.js')> -1){
            //    console.log(filepath + ' updated!');
            // }else{
               build(filepath + ' changed!', true);
            //}
         })
         .on('unlink', (filepath) => {
            this.sbtModule.updateModifyTime();
            build(filepath + ' unlink!', true);
         })
         .on('error', function (error) { console.error('Error happened', error); })
   }

   public build(callback?: Function) {
      // tsc([
      //     '--p',
      //     dir
      // ],callback)

      if (!this._isCompling && this.sbtModule.isDirty()) {
         this._isCompling = true;

         console.log('start build ' + this.getModuleName() + '... ');
         var tsconfig = path.join(this.getModulePath(this.getModuleName()), 'tsconfig.json');
         var tsProject = ts.createProject(tsconfig);
         
         if(this._isDepModule && this._tsComplieOptions){
            for(var i in this._tsComplieOptions){
               tsProject.options[i] = this._tsComplieOptions[i];
            }
         }

         if(!this._isDepModule){
            this._tsComplieOptions = tsProject.options;
         }

         if(this._tsComplieOptions.outDir){
            delete  tsProject.options['outFile']
         }

         if(this._tsComplieOptions.outFile){
            delete tsProject.options['outDir']
         }

         this.buildDeps();
  
         gulp.src(this.getModulePath(this.getModuleName()) + '/**/*.ts')
         //tsProject.src()
             .pipe(sourcemaps.init())
            .pipe(ts(tsProject) as any)
            .pipe(sourcemaps.write('.',{ includeContent: true, sourceRoot: '..' }))
            .pipe(gulp.dest(this.getBuildDest()))
            .on('end', () => {
               this._isCompling = false;
               this.sbtModule.updateComplieTime();
               console.log('build ' + this.getModuleName() + ' finish!')
               if (callback) callback();
            });
      }
   }

   public buildDeps() {
      var config = this.getModuleConfig(this.getModuleName());
      for (var i in config.deps) {
         var dep = config.deps[i];
         var buildTools = this._factory.createBuildTools(dep, this.getAllConfigFiles(),
            this._tsComplieOptions,true
         );
         buildTools.setBuildDest(this.getBuildDest())
         if(!buildTools.sbtModule.isWatching){
            buildTools.watchFilesAndBuild();
         }
      }
   }
}

  