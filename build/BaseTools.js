"use strict";
var path = require('path');
var fs = require('fs');
var FileUtil_1 = require('./lib/FileUtil');
var BaseTools = (function () {
    function BaseTools(configFiles) {
        this._root_path = process.cwd();
        this._configFiles = configFiles;
        this.loadSbtDefaultConfig();
    }
    BaseTools.prototype.getRootPath = function () {
        return this._root_path;
    };
    BaseTools.prototype.getDefaultConfig = function () {
        return this._sbtDefaultConfig;
    };
    BaseTools.prototype.getModuleConfigPath = function (module_path) {
        return path.join(module_path, '');
    };
    BaseTools.prototype.loadSbtDefaultConfig = function () {
        var configFile = path.join(this.getRootPath(), 'sbt.config.js');
        if (fs.existsSync(configFile)) {
            this._sbtDefaultConfig = require(configFile);
        }
        else {
            this._sbtDefaultConfig = {
                findDepsInNodeModules: false,
                onlyScanInSource: true,
                sourcePath: ['src']
            };
        }
    };
    BaseTools.prototype.loadModuleConfig = function (file) {
        var config = require(file);
        return config;
    };
    BaseTools.prototype.getModuleConfig = function (name) {
        var configs = this.getModuleConfigs();
        var item = configs[name];
        item.config.path = item.path;
        if (item) {
            return item.config;
        }
    };
    BaseTools.prototype.getModulePath = function (name) {
        var configs = this.getModuleConfigs();
        var item = configs[name];
        if (item) {
            return item.path;
        }
    };
    BaseTools.prototype.getModuleConfigs = function () {
        if (!this._moduleConfigs) {
            this.loadAllModuleConfigs();
        }
        return this._moduleConfigs;
    };
    BaseTools.prototype.loadAllModuleConfigs = function () {
        this._moduleConfigs = {};
        var allConfigs = this.getAllConfigFiles();
        for (var i in allConfigs) {
            var configFile = allConfigs[i];
            var config = require(configFile);
            if (this._moduleConfigs[config.name]) {
                console.log('module ' + config.name + ' already exist!');
            }
            else {
                this._moduleConfigs[config.name] = {
                    path: path.dirname(configFile),
                    config: config
                };
            }
        }
    };
    BaseTools.prototype.getAllConfigFiles = function () {
        if (!this._configFiles) {
            this._configFiles = this._findModuleConfigs();
        }
        return this._configFiles;
    };
    BaseTools.prototype._findModuleConfigs = function () {
        var sbtConfig = this.getDefaultConfig();
        var allConfigs = [];
        for (var i in sbtConfig.sourcePath) {
            var src = sbtConfig.sourcePath[i];
            var p = path.join(this.getRootPath(), src);
            var moduleConfigs = FileUtil_1.scanSync(p, 'module.js');
            for (var j in moduleConfigs) {
                allConfigs.push(moduleConfigs[j]);
            }
        }
        return allConfigs;
    };
    return BaseTools;
}());
exports.BaseTools = BaseTools;
//# sourceMappingURL=BaseTools.js.map