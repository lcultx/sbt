#!/usr/bin/env node
/// <reference path="../typings/tsd.d.ts" />
"use strict";
import * as program from 'commander';
import {BuildTools} from './lib/tools/BuildTools';
import {PublishTools} from './lib/tools/PublishTools';
import {AstTools} from './lib/tools/AstTools';
import {NativeBuildTools} from './lib/tools/NativeBuildTools';
program.version('0.0.1');

program.command('build <module_name>')
   .option("-q, --quickMode")
   .option("-f, --forceMode")
   .option("-d, --debugMode")
   .option("-c, --buildChildMode")
   .option("-n, --nativeMode")
   .action(function (moduleName, options) {
      console.log('build ' + moduleName);
      if (options.nativeMode) {
         let buildTools = new NativeBuildTools(moduleName);
         buildTools.complie();
      } else {
         let buildTools = new BuildTools(moduleName);
         if (moduleName.indexOf('.ts') > -1) {
            buildTools.complie();
         } else {
            if (options.quickMode) {
               buildTools.enableQuickMode();
            }
            if (options.debugMode) {
               buildTools.enableDebugMode();
            }
            if(options.forceMode){
               buildTools.enableForceMode();
            }
            if(options.buildChildMode){
               buildTools.enableBuildChildMode();
            }
            if(options.quickMode){
               buildTools.quickComplie();
            }else{
               buildTools.complie();
            }

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
