import {ComplieTools} from './ComplieTools'
var existBuildTools: {
   [name: string]: ComplieTools
} = {};

export class ComplieToolsFactory {
   public createBuildTools(moduleName: string,
      configFiles?: Array<string>,
      tsComplieOptions?: any,
      isDepModule?: boolean) {
      if (!existBuildTools[moduleName]) {
         existBuildTools[moduleName] = new ComplieTools(moduleName, configFiles, tsComplieOptions, isDepModule)
      } 
      return existBuildTools[moduleName];
   }
}  