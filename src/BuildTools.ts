import {tsc} from './lib/tsc';
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as path from 'path';

import {BaseTools} from './BaseTools'

export class BuildTools extends BaseTools {

  public getBuildDest(){
      return path.join('build',this.getModuleName())
  }

  public build(callback: Function) {
    // tsc([
    //     '--p',
    //     dir
    // ],callback)
    var tsconfig = path.join(this.getModulePath(), 'tsconfig.json');
    var tsProject = ts.createProject(tsconfig);
    console.log(this.getBuildDest())
    gulp.src(this.getModulePath() + '/**/*.ts')
      .pipe(ts(tsProject) as any)
      .pipe(gulp.dest(this.getBuildDest()));
  }
}

