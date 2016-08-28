var path = require('path');
var tsc_file = path.join(__dirname, '../../', 'node_modules', 'typescript', 'lib', 'tsc.js');
function tsc(args, callback) {
    var spawn = require('child_process').spawn;
    var call_args = [tsc_file];
    for (var i in args) {
        call_args.push(args[i]);
    }
    var cmd = 'node ';
    for (var i in call_args) {
        cmd += call_args[i] + ' ';
    }
    console.log(cmd);
    var tsc = spawn('node', call_args);
    tsc.stdout.on('data', function (data) {
        console.log("stdout: " + data);
    });
    tsc.stderr.on('data', function (data) {
        console.log("stderr: " + data);
    });
    tsc.on('close', function (code) {
        callback(code);
    });
}
exports.tsc = tsc;
//# sourceMappingURL=tsc.js.map