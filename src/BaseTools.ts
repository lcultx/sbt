import * as path from 'path'
export class BaseTools{

    private _module_path:string;
    public getModulePath(){
        return this._module_path;
    }
    constructor(module_path:string){
        this._module_path = module_path;
    }

    public getModuleName(){
        return path.basename(this.getModulePath());
    }

    private getModuleNameByPath(){
          return path.basename(this.getModulePath());
    }

    private getModuleNameByPackage(){

    }

    private getModuleNameByModule(){
        
    }
}