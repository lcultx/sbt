#!/usr/bin/env node
/// <reference path="../typings/tsd.d.ts" />
"use strict";
import * as program from 'commander';
import {BuildTools} from './lib/tools/BuildTools';
import {AstTools} from './lib/tools/AstTools';

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
   .option("-q, --quickMode")
   .option("-d, --debugMode")
   .action(function (moduleName, options) {
      console.log('build ' + moduleName);
      var buildTools = new BuildTools(moduleName);
      if (moduleName.indexOf('.ts') > -1) {
         buildTools.complie();
      } else {
         if (options.quickMode) {
            buildTools.enableQuickMode();
         }
         if(options.debugMode){
            buildTools.enableDebugMode();
         }
         buildTools.watchFilesAndBuild();
      }


   })

program.command('ast <module_name>')
   .option("-s, --saveFile")
   // .option("-p, --property")
   // .option("-m, --method")
   .action(function (moduleName, options) {
      var astTools = new AstTools();
      astTools.parser(moduleName);
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
