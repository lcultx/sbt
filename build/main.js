#!/usr/bin/env node
"use strict";
const program = require('commander');
const BuildTools_1 = require('./BuildTools');
program.version('0.0.1');
let a = 1;
program.command('build <module_name>')
    .option("-w, --watchFile")
    .action(function (moduleName, options) {
    console.log('build ' + moduleName);
    var buildTools = new BuildTools_1.BuildTools(moduleName);
    buildTools.watchFilesAndBuild();
    buildTools.build((err) => { });
});
program.on('--help', function () {
    console.log('  Examples:');
    console.log();
    console.log('    $ sbt publish src/tools');
    console.log('    $ sbt build src/tools -w');
    console.log('    $ sbt init src/plugin/myplugin');
    console.log();
});
program.parse(process.argv);
//# sourceMappingURL=main.js.map