import * as path from 'path'
var ts2c_file = path.join(__dirname,'../../../','node_modules','ts2c','build','ts2c.js');
export function ts2c(args:Array<string>,callback:Function) {
    const spawn = require('child_process').spawn;
    var call_args = [ts2c_file];
    for(var i in args){
        call_args.push(args[i]);
    }

    var cmd = 'node ';
    for(var i in call_args){  
        cmd += call_args[i] + ' ';
    }
    console.log(cmd);

    const tsc = spawn('node',call_args);

    tsc.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    tsc.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    tsc.on('close', (code) => {
        //console.log(`child process exited with code ${code}`);
        callback(code);
    });
}