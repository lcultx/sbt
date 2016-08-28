"use strict";
const path = require('path');
const fs = require('fs');
const FileUtil_1 = require('./lib/FileUtil');
class BaseTools {
    constructor(configFiles) {
        this._root_path = process.cwd();
        this._configFiles = configFiles;
        this.loadSbtDefaultConfig();
    }
    getRootPath() {
        return this._root_path;
    }
    getDefaultConfig() {
        return this._sbtDefaultConfig;
    }
    getModuleConfigPath(module_path) {
        return path.join(module_path, '');
    }
    loadSbtDefaultConfig() {
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
    }
    loadModuleConfig(file) {
        var config = require(file);
        return config;
    }
    getModuleConfig(name) {
        var configs = this.getModuleConfigs();
        var item = configs[name];
        if (item) {
            return item.config;
        }
    }
    getModulePath(name) {
        var configs = this.getModuleConfigs();
        var item = configs[name];
        if (item) {
            return item.path;
        }
    }
    getModuleConfigs() {
        if (!this._moduleConfigs) {
            this.loadAllModuleConfigs();
        }
        return this._moduleConfigs;
    }
    loadAllModuleConfigs() {
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
    }
    getAllConfigFiles() {
        if (!this._configFiles) {
            this._configFiles = this._findModuleConfigs();
        }
        return this._configFiles;
    }
    _findModuleConfigs() {
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
    }
}
exports.BaseTools = BaseTools;
//# sourceMappingURL=BaseTools.js.map