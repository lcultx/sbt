#!/usr/bin/env node
"use strict";
var program = require('commander');
var BuildTools_1 = require('./BuildTools');
var AstTools_1 = require('./AstTools');
program.version('0.0.1');
var a = 1;
program.command('build <module_name>')
    .option("-w, --watchFile")
    .option("-q, --quickMode")
    .action(function (moduleName, options) {
    console.log('build ' + moduleName);
    var buildTools = new BuildTools_1.BuildTools(moduleName);
    if (moduleName.indexOf('.ts') > -1) {
        buildTools.complie();
    }
    else {
        if (options.quickMode) {
            buildTools.enableQuickMode();
        }
        buildTools.watchFilesAndBuild();
        buildTools.build(function (err) { });
    }
});
program.command('ast <module_name>')
    .option("-s, --saveFile")
    .action(function (moduleName, options) {
    var astTools = new AstTools_1.AstTools();
    astTools.parser(moduleName);
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