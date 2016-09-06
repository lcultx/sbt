// var workerFarm = require('worker-farm')
//    , workers = workerFarm(require.resolve('./buildInChildProcess'))

// var existBuildTools: {
//    [name: string]: boolean
// } = {};


// export  function build(config: {
//    moduleName: string,
//    configFiles?: Array<string>,
//    tsComplieOptions?: any,
//    isDepModule?: boolean,
//    debugMode?: boolean,
//    quickMode?: boolean
// }
// ) {
//    if (!existBuildTools[config.moduleName]) {
//       workers(JSON.stringify(config), function (err, outp) {
//          console.log(outp)
//          workerFarm.end(workers)
//       })
//       existBuildTools[config.moduleName] = true;
//    }
 
// }
