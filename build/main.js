#!/usr/bin/env node
var program = require('commander');
var BuildTools_1 = require('./BuildTools');
program.version('0.0.1');
program.command('build <dir>')
    .option("-w, --watchFile")
    .action(function (dir, options) {
    console.log('build ' + dir);
    console.log(options.watchFile);
    var buildTools = new BuildTools_1.BuildTools(dir);
    buildTools.build(function (err) {
        if (!err) {
            console.log('build success!');
        }
    });
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