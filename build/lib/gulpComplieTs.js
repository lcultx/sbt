"use strict";
var gulp = require('gulp');
var ts = require('gulp-typescript');
gulp.src('src/**/*.ts')
    .pipe(ts({
    noImplicitAny: true,
    out: 'output.js'
}))
    .pipe(gulp.dest('built/local'));
//# sourceMappingURL=gulpComplieTs.js.map