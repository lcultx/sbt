import * as Datastore from 'nedb';
import * as path from 'path';

var dbFile = path.join(process.cwd(),'.sbt','module');

var db = new Datastore({ filename: dbFile });
db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});

export class SbtModule{
    public name: string;
    public deps: Array<string>;
    public path:string;

    private _modifyTime:number;
    private _complieTime:number;

    public isWatching:boolean;

    public getModifyTime(){
       return this._modifyTime || 0;
    }

    constructor(config:{
       name:string,
       deps:Array<string>
    }){
       this.name = config.name;
       this.deps = config.deps;
    }

    public updateModifyTime(){
      this._modifyTime = new Date().getTime()
    }

    public getComplieTime(){
       return this._complieTime || -1;
    }

    public updateComplieTime(){
       this._complieTime = new Date().getTime();
    }

    public isDirty(){
       return this.getComplieTime() < this.getModifyTime()
    }

    public build(){

    }

    public buildDeps(){
      
    }
}