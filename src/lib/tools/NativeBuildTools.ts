import * as gulp from 'gulp';
import * as path from 'path';
import * as fs from 'fs';
import {ts2c} from '../mts/ts2c';
import {gcc} from '../mts/gcc';
import {BuildTools} from './BuildTools';


export class NativeBuildTools extends BuildTools {
   public complie() {
      var startBuildTime = new Date().getTime();
      var files = this.getNeedComplieFiles();
      ts2c(files, () => {
         var cfile = this.getFileName(files[0]) + '.c';
         console.log(cfile)
         gcc([cfile], () => {
            var endBuildTime = new Date().getTime();
            console.log('build ' + this.getModuleName() + ' finish, time cost: ', endBuildTime - startBuildTime);
         })
      });

   }

   private getFileName(file){
      return path.basename(file).split(path.dirname(file))[0]
   }
}

