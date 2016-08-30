import * as path from 'path'
export class SbtModuleConfig{
     public name: string
     public path:string
     public deps: Array<string>;
     public configFilePath:string;
     public loaderType:string;

     public initByFile(file:string){
        this.configFilePath = file;
        var config = require(file);
        this.path =  path.dirname(file);
        this.name = config.name;
        this.deps = config.deps;
        this.loaderType = config.loaderType;
     }

}