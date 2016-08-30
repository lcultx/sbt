"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var BuildToolsFactory_1 = require('./BuildToolsFactory');
var gcallback = require('gulp-callback');
var BaseTools_1 = require('./BaseTools');
var chokidar = require('chokidar');
var SbtModule_1 = require('./SbtModule');
var ts = require("typescript");
var BuildTools = (function (_super) {
    __extends(BuildTools, _super);
    function BuildTools(moduleName, configFiles, tsComplieOptions, isDepModule) {
        _super.call(this, configFiles);
        this._needComplieFiles = [];
        this.firstBuild = true;
        if (moduleName.indexOf('.ts') > -1) {
            this.initFiles(moduleName);
        }
        else {
            this.init(moduleName, configFiles, tsComplieOptions, isDepModule);
        }
    }
    BuildTools.prototype.enableQuickMode = function () {
        this._quickMode = true;
    };
    BuildTools.prototype.disableQuickMode = function () {
        this._quickMode = false;
    };
    BuildTools.prototype.initFiles = function (files) {
        this._quickMode = true;
        this._needComplieFiles = files.split(' ');
        console.log(this._needComplieFiles);
    };
    BuildTools.prototype.init = function (moduleName, configFiles, tsComplieOptions, isDepModule) {
        this._moduleName = moduleName;
        this._tsComplieOptions = tsComplieOptions;
        this._isCompling = false;
        this._isDepModule = isDepModule;
        this._factory = new BuildToolsFactory_1.BuildToolsFactory();
        this.sbtModule = new SbtModule_1.SbtModule(this.getModuleConfig(moduleName));
    };
    BuildTools.prototype.getModuleName = function () {
        return this._moduleName;
    };
    BuildTools.prototype.getBuildDest = function () {
        return this._dest || path.join('build');
    };
    BuildTools.prototype.setBuildDest = function (dest) {
        this._dest = dest;
    };
    BuildTools.prototype.watchFilesAndBuild = function () {
        var _this = this;
        var dir = this.getModulePath(this.getModuleName());
        console.log('watching ' + dir);
        var build = function (msg, printMsg) {
            if (printMsg) {
                console.log(_this.getModuleName() + ' build watcher get file change event:');
                console.log(msg);
            }
            _this.build();
        };
        var watcher = chokidar.watch(dir, { ignored: /^\./, persistent: true });
        this.sbtModule.isWatching = true;
        watcher
            .on('add', function (file) {
            _this.sbtModule.updateModifyTime();
            _this.addFileToNextComplie(file);
            if (file.indexOf('_ref') > -1) {
                _this.sbtModule.addRef(file);
            }
            build(file + ' added!', false);
        })
            .on('change', function (file) {
            _this.sbtModule.updateModifyTime();
            _this.addFileToNextComplie(file);
            build(file + ' changed!', true);
        })
            .on('unlink', function (filepath) {
            _this.sbtModule.updateModifyTime();
            build(filepath + ' unlink!', true);
        })
            .on('error', function (error) { console.error('Error happened', error); });
    };
    BuildTools.prototype.addFileToNextComplie = function (file) {
        if (file.indexOf('.ts') > -1 && this._needComplieFiles.indexOf(file) == -1) {
            this._needComplieFiles.push(file);
        }
    };
    BuildTools.prototype.clearNeedComplieFiles = function () {
        this._needComplieFiles = [];
    };
    BuildTools.prototype.getNeedComplieFiles = function () {
        if (this._needComplieFiles.length > 0) {
            return this._needComplieFiles;
        }
    };
    BuildTools.prototype.getAllProjectFiles = function () {
        return this.sbtModule.getAllTsFiles();
    };
    BuildTools.prototype.build = function (callback) {
        var _this = this;
        var tsconfig = path.join(this.getModulePath(this.getModuleName()), 'tsconfig.json');
        this._tsComplieOptions = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            allowJs: true,
            noImplicitAny: false,
            removeComments: false,
            noLib: false,
            preserveConstEnums: true,
            suppressImplicitAnyIndexErrors: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            sourceMap: true,
            outDir: './build',
            jsx: ts.JsxEmit.React
        };
        if (!this._isCompling && this.sbtModule.isDirty()) {
            this._isCompling = true;
            var build = function () {
                var startBuildTime = new Date().getTime();
                _this.complie();
                var endBuildTime = new Date().getTime();
                console.log('build ' + _this.getModuleName() + ' finish, time cost: ', endBuildTime - startBuildTime);
            };
            if (this.firstBuild) {
                this.firstBuild = false;
                setTimeout(build, 100);
            }
            else {
                setTimeout(build, 10);
            }
        }
    };
    BuildTools.prototype.complie = function () {
        this._isCompling = true;
        var files = [];
        if (this._quickMode) {
            files = this.getNeedComplieFiles();
        }
        else {
            files = this.getAllProjectFiles();
        }
        console.log('start build ' + this.getModuleName() + ', with ' + files.length + ' files... ');
        var refs = this.sbtModule.getRefs();
        for (var i in refs) {
            var ref = refs[i];
            if (files.indexOf(ref) == -1) {
                files.push(ref);
            }
        }
        var program = ts.createProgram(files, this._tsComplieOptions || {
            noEmitOnError: true, noImplicitAny: true,
            target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS,
            sourceMap: true, sourceRoot: ''
        });
        var emitResult = program.emit();
        var allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
        allDiagnostics.forEach(function (diagnostic) {
            var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
            var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message);
        });
        this.clearNeedComplieFiles();
        this._isCompling = false;
    };
    BuildTools.prototype.buildDeps = function () {
        var config = this.getModuleConfig(this.getModuleName());
        for (var i in config.deps) {
            var dep = config.deps[i];
            var buildTools = this._factory.createBuildTools(dep, this.getAllConfigFiles(), this._tsComplieOptions, true);
            buildTools.setBuildDest(this.getBuildDest());
            if (!buildTools.sbtModule.isWatching) {
                buildTools.watchFilesAndBuild();
            }
        }
    };
    return BuildTools;
}(BaseTools_1.BaseTools));
exports.BuildTools = BuildTools;
//# sourceMappingURL=BuildTools.js.map