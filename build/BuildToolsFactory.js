"use strict";
var BuildTools_1 = require('./BuildTools');
var existBuildTools = {};
var BuildToolsFactory = (function () {
    function BuildToolsFactory() {
    }
    BuildToolsFactory.prototype.createBuildTools = function (moduleName, configFiles, tsComplieOptions, isDepModule) {
        if (!existBuildTools[moduleName]) {
            existBuildTools[moduleName] = new BuildTools_1.BuildTools(moduleName, configFiles, tsComplieOptions, isDepModule);
        }
        return existBuildTools[moduleName];
    };
    return BuildToolsFactory;
}());
exports.BuildToolsFactory = BuildToolsFactory;
//# sourceMappingURL=BuildToolsFactory.js.map