"use strict";
const BuildTools_1 = require('./BuildTools');
var existBuildTools = {};
class BuildToolsFactory {
    createBuildTools(moduleName, configFiles, tsComplieOptions, isDepModule) {
        if (!existBuildTools[moduleName]) {
            existBuildTools[moduleName] = new BuildTools_1.BuildTools(moduleName, configFiles, tsComplieOptions, isDepModule);
        }
        return existBuildTools[moduleName];
    }
}
exports.BuildToolsFactory = BuildToolsFactory;
//# sourceMappingURL=BuildToolsFactory.js.map