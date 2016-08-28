#!/usr/bin/env node
/// <reference path="../typings/tsd.d.ts" />

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


program.command('build <dir>')
    .option("-w, --watchFile")
    .action(function (dir, options) {
        console.log('build ' + dir);
        console.log(options.watchFile);
        var buildTools = new BuildTools(dir);
        buildTools.build((err) => {
            if (!err) {
                console.log('build success!')
            }
        });
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
