import * as path from 'path'

export class CopyAction{
   public from:string;
   public to:string;
}

export class PublishConfig{
   public concat:boolean;
   public concatFiles:Array<string>;
   public filter:boolean;
   public filterFunction:Function;

   public minify:boolean;
   public binaryCompress:boolean;
   public copyResource:boolean;
   public addVersionNumber:boolean;

   public copyResourceActions:Array<CopyAction>;
   public needVersionFiles:Array<string>;

   public beforeConcat:Function;
   public afterConcat:Function;
   public beforeComplie:Function;
   public afterComplie:Function;
   public beforeFliter:Function;
   public afterFliter:Function;
   public beforeMinify:Function;
   public afterMinify:Function;
   public beforeBinrayCompress:Function;
   public afterBinrayCompress:Function;
   public beforeCopyResource:Function;
   public afterCompyResource:Function;
   public beforeAddVersionNumber:Function;
   public afterAddVersionNumber:Function;

} 
export class SbtModuleConfig{
     public name: string
     public path:string
     public deps: Array<string>;
     public configFilePath:string;
     public loaderType:string;

     public publish:PublishConfig;

     public initByFile(file:string){
        this.configFilePath = file;
        var config = require(file);
        this.path =  path.dirname(file);
        this.name = config.name;
        this.deps = config.deps;
        this.loaderType = config.loaderType;
        this.publish = config.publish;
     }

}