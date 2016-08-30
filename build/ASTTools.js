"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SbtModule_1 = require('./SbtModule');
var fs = require('fs');
var BaseTools_1 = require('./BaseTools');
var AstTools = (function (_super) {
    __extends(AstTools, _super);
    function AstTools() {
        _super.apply(this, arguments);
        this.propertys = [];
        this.methods = [];
        this.mreg = /[^}]*?\s+([^=:\(\()@\.]*)\s+{/;
        this.preg = /(public)|(private)/;
    }
    AstTools.prototype.parser = function (name) {
        this.sbtModule = new SbtModule_1.SbtModule(this.getModuleConfig(name));
        var tsFiles = this.sbtModule.getAllTsFiles();
        var astConfig = this.sbtModule.getAstConfig();
        for (var i in tsFiles) {
            var file = tsFiles[i];
            this.parserFile(file);
        }
    };
    AstTools.prototype.parserFile = function (file) {
        var content = fs.readFileSync(file, 'utf-8');
        this.parserFileContent(content);
    };
    AstTools.prototype.parserFileContent = function (text) {
        var lines = text.split('\n');
        for (var i in lines) {
            var line = lines[i];
            this.parseLine(line);
        }
    };
    AstTools.prototype.parseLine = function (line) {
        if (line.indexOf(' else ') > -1 || line.indexOf(' class ') > -1 || line.indexOf(' return ') > -1
            || line.indexOf(' as ') > -1) {
            return;
        }
        if (this.mreg.test(line)) {
            var rl = this.mreg.exec(line);
            var name = rl[1];
            if (name) {
                console.log(line);
                console.log(name);
                this.methods.push(name);
            }
        }
    };
    return AstTools;
}(BaseTools_1.BaseTools));
exports.AstTools = AstTools;
//# sourceMappingURL=AstTools.js.map