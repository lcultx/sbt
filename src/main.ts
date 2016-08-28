#!/usr/bin/env node
/// <reference path="../typings/tsd.d.ts" />
"use strict";
import * as program from 'commander';
import {BuildTools} from './BuildTools';
// 初始化空间

// program
//     .version('0.0.1')
//     .option('-p, --peppers', 'Add peppers')
//     .option('-P, --pineapple', 'Add pineapple')
//     .option('-b, --bbq', 'Add bbq sauce')
//     .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
//     .parse(process.argv);

program.version('0.0.1');

let a = 1;

program.command('build <module_name>')
   .option("-w, --watchFile")
   .action(function (moduleName, options) {
      console.log('build ' + moduleName);
      var buildTools = new BuildTools(moduleName);
      buildTools.watchFilesAndBuild();
      buildTools.build((err) => { }); 
   })

program.on('--help', function () {
   console.log('  Examples:');
   console.log();
   console.log('    $ sbt publish src/tools');
   console.log('    $ sbt build src/tools -w');
   console.log('    $ sbt init src/plugin/myplugin');
   console.log();
});

program.parse(process.argv);
