import * as Datastore from 'nedb';
import * as path from 'path';
import * as fs from 'fs';
import {filterScanSync} from '../utils/FileUtil'
import {TsSourceFile} from './TsSourceFile'
var dbFile = path.join(process.cwd(), '.sbt', 'module');

var db = new Datastore({ filename: dbFile });
db.loadDatabase(function (err) {    // Callback is optional
   // Now commands will be executed
});

export class SbtModule {
   public name: string;
   public deps: Array<string>;
   public path: string;

   private _modifyTime: number;
   private _complieTime: number;

   private _refs:Array<string> = [];

   public isWatching: boolean;

   public getModifyTime() {
      return this._modifyTime || 0;
   }

   public addRef(ref:string){
      this._refs.push(ref);
   }

   public getRefs(){
      return this._refs;
   }

   constructor(config: {
      name: string,
      path?: string,
      deps?: Array<string>
   }) {
      this.name = config.name;
      this.deps = config.deps;
      this.path = config.path;
   }

   public updateModifyTime() {
      this._modifyTime = new Date().getTime()
   }

   public getComplieTime() {
      return this._complieTime || -1;
   }
 
   public updateComplieTime() {
      this._complieTime = new Date().getTime();
   }

   public isDirty() {
      return this.getComplieTime() < this.getModifyTime()
   }

   public build() {

   }

   public buildDeps() {

   }
   private _tsFiles;
   public getAllTsFiles():Array<string> {
      if(!this._tsFiles){
         this._tsFiles = filterScanSync(this.path,(file)=>{
           return TsSourceFile.isTsSourceFile(file);
         });
      }
      return this._tsFiles;
   }

   private _astConfig:{
      exclude:Array<string>  
   };
   public getAstConfig(){
      if(!this._astConfig){
         this._astConfig = require(path.join(this.path,'ast.js'))
      }
      return this._astConfig
   }

}