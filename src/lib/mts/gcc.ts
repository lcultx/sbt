import * as path from 'path'

function getFileName(file) {
   return path.basename(file).split(path.dirname(file))[0]
} 

export function gcc(args: Array<string>, callback: Function) {
   const spawn = require('child_process').spawn;
   var call_args = ['-g'];
   var file = args[0];
   call_args.push(file);
   call_args.push('-o')
   call_args.push(getFileName(file) + '.exe');

   var cmd = 'gcc ';
   for (var i in call_args) {
      cmd += call_args[i] + ' ';
   }
   console.log(cmd);


   const tsc = spawn('gcc', call_args);

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