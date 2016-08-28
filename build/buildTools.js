"use strict";
const gulp = require('gulp');
const ts = require('gulp-typescript');
const path = require('path');
const BuildToolsFactory_1 = require('./BuildToolsFactory');
var gcallback = require('gulp-callback');
const BaseTools_1 = require('./BaseTools');
var chokidar = require('chokidar');
const SbtModule_1 = require('./SbtModule');
class BuildTools extends BaseTools_1.BaseTools {
    constructor(moduleName, configFiles, tsComplieOptions, isDepModule) {
        super(configFiles);
        this._moduleName = moduleName;
        this._tsComplieOptions = tsComplieOptions;
        this._isCompling = false;
        this._isDepModule = isDepModule;
        this._factory = new BuildToolsFactory_1.BuildToolsFactory();
        this.sbtModule = new SbtModule_1.SbtModule(this.getModuleConfig(moduleName));
    }
    getModuleName() {
        return this._moduleName;
    }
    getBuildDest() {
        return this._dest || path.join('build');
    }
    setBuildDest(dest) {
        this._dest = dest;
    }
    watchFilesAndBuild() {
        var dir = this.getModulePath(this.getModuleName());
        console.log('watching ' + dir);
        var build = (msg, printMsg) => {
            if (printMsg) {
                console.log(this.getModuleName() + ' build watcher get file change event:');
                console.log(msg);
            }
            this.build();
        };
        var watcher = chokidar.watch(dir, { ignored: /^\./, persistent: true });
        this.sbtModule.isWatching = true;
        watcher
            .on('add', (filepath) => {
            this.sbtModule.updateModifyTime();
            build(filepath + ' added!', false);
        })
            .on('change', (filepath) => {
            this.sbtModule.updateModifyTime();
            build(filepath + ' changed!', true);
        })
            .on('unlink', (filepath) => {
            this.sbtModule.updateModifyTime();
            build(filepath + ' unlink!', true);
        })
            .on('error', function (error) { console.error('Error happened', error); });
    }
    build(callback) {
        if (!this._isCompling && this.sbtModule.isDirty()) {
            this._isCompling = true;
            console.log('start build ' + this.getModuleName() + '... ');
            var tsconfig = path.join(this.getModulePath(this.getModuleName()), 'tsconfig.json');
            var tsProject = ts.createProject(tsconfig);
            if (this._isDepModule && this._tsComplieOptions) {
                for (var i in this._tsComplieOptions) {
                    tsProject.options[i] = this._tsComplieOptions[i];
                }
            }
            if (!this._isDepModule) {
                this._tsComplieOptions = tsProject.options;
            }
            if (this._tsComplieOptions.outDir) {
                delete tsProject.options['outFile'];
            }
            if (this._tsComplieOptions.outFile) {
                delete tsProject.options['outDir'];
            }
            this.buildDeps();
            gulp.src(this.getModulePath(this.getModuleName()) + '/**/*.ts')
                .pipe(ts(tsProject))
                .pipe(gulp.dest(this.getBuildDest()))
                .on('end', () => {
                this._isCompling = false;
                this.sbtModule.updateComplieTime();
                console.log('build ' + this.getModuleName() + ' finish!');
                if (callback)
                    callback();
            });
        }
    }
    buildDeps() {
        var config = this.getModuleConfig(this.getModuleName());
        for (var i in config.deps) {
            var dep = config.deps[i];
            var buildTools = this._factory.createBuildTools(dep, this.getAllConfigFiles(), this._tsComplieOptions, true);
            buildTools.setBuildDest(this.getBuildDest());
            if (!buildTools.sbtModule.isWatching) {
                buildTools.watchFilesAndBuild();
            }
        }
    }
}
exports.BuildTools = BuildTools;
//# sourceMappingURL=BuildTools.js.map