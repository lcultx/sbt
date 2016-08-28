var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var gulp = require('gulp');
var ts = require('gulp-typescript');
var path = require('path');
var BaseTools_1 = require('./BaseTools');
var BuildTools = (function (_super) {
    __extends(BuildTools, _super);
    function BuildTools() {
        _super.apply(this, arguments);
    }
    BuildTools.prototype.getBuildDest = function () {
        return path.join('build', this.getModuleName());
    };
    BuildTools.prototype.build = function (callback) {
        var tsconfig = path.join(this.getModulePath(), 'tsconfig.json');
        var tsProject = ts.createProject(tsconfig);
        console.log(this.getBuildDest());
        gulp.src(this.getModulePath() + '/**/*.ts')
            .pipe(ts(tsProject))
            .pipe(gulp.dest(this.getBuildDest()));
    };
    return BuildTools;
}(BaseTools_1.BaseTools));
exports.BuildTools = BuildTools;
//# sourceMappingURL=BuildTools.js.map