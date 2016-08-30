import * as path from 'path';
import * as fs from 'fs';
import * as async from 'async';
import {scanSync} from './lib/FileUtil';
export class BaseTools {

   private _root_path: string;
   private _sbtDefaultConfig: {
      findDepsInNodeModules: boolean,
      onlyScanInSource: boolean,
      sourcePath: Array<string>
   };

   private _configFiles:Array<string>;

   private _moduleConfigs: {
      [name: string]: {
         path: string,
         config: {
            name: string,
            path:string,
            deps: Array<string>
         }
      }
   }

   public getRootPath() {
      return this._root_path;
   }

   public getDefaultConfig() {
      return this._sbtDefaultConfig;
   }


   constructor(configFiles?:Array<string>) {
      this._root_path = process.cwd();
      this._configFiles = configFiles;
      this.loadSbtDefaultConfig();
   }

   private getModuleConfigPath(module_path) {
      return path.join(module_path, '')
   }

   private loadSbtDefaultConfig() {
      var configFile = path.join(this.getRootPath(), 'sbt.config.js');
      if (fs.existsSync(configFile)) {
         this._sbtDefaultConfig = require(configFile)
      } else {
         this._sbtDefaultConfig = {
            findDepsInNodeModules: false,
            onlyScanInSource: true,
            sourcePath: ['src']
         }
      }
   }

   private loadModuleConfig(file: string) {
      var config = require(file);
      return config;
   }

   public getModuleConfig(name: string) {
      var configs = this.getModuleConfigs();
      var item = configs[name];
      item.config.path = item.path;
      if (item) {
         return item.config;
      }
   }

   public getModulePath(name: string) {
      var configs = this.getModuleConfigs();
      var item = configs[name];
      if (item) {
         return item.path;
      }
   }


   public getModuleConfigs() {
      if (!this._moduleConfigs) {
         this.loadAllModuleConfigs();
      }
      return this._moduleConfigs;
   }

   private loadAllModuleConfigs() {
      this._moduleConfigs = {};
      var allConfigs = this.getAllConfigFiles();
      for (var i in allConfigs) {
         var configFile = allConfigs[i];
         var config = require(configFile);
         if (this._moduleConfigs[config.name]) {
            console.log('module ' + config.name + ' already exist!');
         } else {
            this._moduleConfigs[config.name] = {
               path: path.dirname(configFile),
               config: config
            }
         }
      }
   }

   public getAllConfigFiles(){
      if(!this._configFiles){
         this._configFiles = this._findModuleConfigs();
      }
      return this._configFiles;
   }

   private _findModuleConfigs() {
      var sbtConfig = this.getDefaultConfig();
      var allConfigs = [];
      for (var i in sbtConfig.sourcePath) {
         var src = sbtConfig.sourcePath[i];
         var p = path.join(this.getRootPath(), src);
         var moduleConfigs = scanSync(p, 'module.js');
         for (var j in moduleConfigs) {
            allConfigs.push(moduleConfigs[j])
         }
      }
      //console.log(allConfigs)
      return allConfigs;
   }


}


