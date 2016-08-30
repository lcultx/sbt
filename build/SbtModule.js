"use strict";
var Datastore = require('nedb');
var path = require('path');
var FileUtil_1 = require('./lib/FileUtil');
var dbFile = path.join(process.cwd(), '.sbt', 'module');
var db = new Datastore({ filename: dbFile });
db.loadDatabase(function (err) {
});
var SbtModule = (function () {
    function SbtModule(config) {
        this._refs = [];
        this.name = config.name;
        this.deps = config.deps;
        this.path = config.path;
    }
    SbtModule.prototype.getModifyTime = function () {
        return this._modifyTime || 0;
    };
    SbtModule.prototype.addRef = function (ref) {
        this._refs.push(ref);
    };
    SbtModule.prototype.getRefs = function () {
        return this._refs;
    };
    SbtModule.prototype.updateModifyTime = function () {
        this._modifyTime = new Date().getTime();
    };
    SbtModule.prototype.getComplieTime = function () {
        return this._complieTime || -1;
    };
    SbtModule.prototype.updateComplieTime = function () {
        this._complieTime = new Date().getTime();
    };
    SbtModule.prototype.isDirty = function () {
        return this.getComplieTime() < this.getModifyTime();
    };
    SbtModule.prototype.build = function () {
    };
    SbtModule.prototype.buildDeps = function () {
    };
    SbtModule.prototype.getAllTsFiles = function () {
        if (!this._tsFiles) {
            this._tsFiles = FileUtil_1.scanSync(this.path, '.ts');
        }
        return this._tsFiles;
    };
    SbtModule.prototype.getAstConfig = function () {
        if (!this._astConfig) {
            this._astConfig = require(path.join(this.path, 'ast.js'));
        }
        return this._astConfig;
    };
    return SbtModule;
}());
exports.SbtModule = SbtModule;
//# sourceMappingURL=SbtModule.js.map