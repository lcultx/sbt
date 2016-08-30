import {BuildTools} from './BuildTools'
var existBuildTools: {
   [name: string]: BuildTools
} = {};

export class BuildToolsFactory {
   public createBuildTools(moduleName: string,
      configFiles?: Array<string>,
      tsComplieOptions?: any,
      isDepModule?: boolean) {
      if (!existBuildTools[moduleName]) {
         existBuildTools[moduleName] = new BuildTools(moduleName, configFiles, tsComplieOptions, isDepModule)
      } 
      return existBuildTools[moduleName];
      
   }
}