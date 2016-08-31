#!/usr/bin/env node
/// <reference path="../typings/tsd.d.ts" />
"use strict";
import * as program from 'commander';
import {BuildTools} from './lib/tools/BuildTools';
import {PublishTools} from './lib/tools/PublishTools';
import {AstTools} from './lib/tools/AstTools';

program.version('0.0.1');

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
            options.watchFile = true;
         }
         if (options.debugMode) {
            buildTools.enableDebugMode();
         }
         if(options.watchFile){
            buildTools.watchFilesAndBuild();
         }else{
            buildTools.complie();
         }
         
      }
   })

program.command('publish <module_name>')
   .option("-d, --debugMode")
   .action(function (moduleName, options) {
      console.log('build ' + moduleName);
      var publishTools = new PublishTools(moduleName);

      if (options.debugMode) {
         publishTools.enableDebugMode();
      }
      publishTools.publish();

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
