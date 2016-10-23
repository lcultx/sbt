import {ComplieTools} from './ComplieTools'
import * as ts from "typescript";
import * as fs from 'fs';
import * as path from 'path';
var fsExtra = require('fs-extra')
var UglifyJS = require("uglify-js");
var lzma = require('lzma');
//var cc = require('closure-compiler');
import {addVersionNumberToFiles} from '../utils/version'
export class BuildTools extends ComplieTools {

   private _watchMode:boolean = false;
   public enableWatchMode(){
         this._watchMode = true;
   }
   public _build() {
      //编译js文件
      this.complie();
      //拷贝资源 copy  source target
      this.copyResource();
      //添加版本号 
      this.addVersionNumber();
   }

   public build(){
         if(this._watchMode){
               var modulePath = this.getModulePath(this.getModuleName());
               fs.watch(modulePath,()=>{
                     this._build()
               })
         }
   }

   public getBuildConfig() {
      var config = this.getModuleConfig(this.getModuleName());
      return config.build;
   }


   private copyResource() {
      var config = this.getBuildConfig();
      if (config) {
         var enabled = config.copyResource === false ? false : true;
         if (enabled && config.copyResourceActions) {
            if (config.beforeCopyResource instanceof Function) {
               config.beforeCopyResource();
            }
            for (var i in config.copyResourceActions) {
               var action = config.copyResourceActions[i];
               console.log('copy file ' + action.from + ' to ' + action.to);
               fsExtra.copySync(action.from, action.to)
            }
            if (config.afterCompyResource instanceof Function) {
               config.afterCompyResource();
            }
         }
      }
   }

   private addVersionNumber() {
      var config = this.getBuildConfig();
      if (config) {
         var enabled = config.addVersionNumber === false ? false : true;
         if (enabled && config.needVersionFiles) {
            if (config.beforeAddVersionNumber instanceof Function) {
               config.beforeAddVersionNumber();
            }
            addVersionNumberToFiles(config.needVersionFiles);
            if (config.afterAddVersionNumber instanceof Function) {
               config.afterAddVersionNumber();
            }
         }
      }
   }

   private readFile(file) {
      return fs.readFileSync(file, 'utf-8');
   }

   private writeFile(file, content) {
      fs.writeFileSync(file, content, 'utf-8');
   }
}