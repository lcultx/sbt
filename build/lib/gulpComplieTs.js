"use strict";
const gulp = require('gulp');
const ts = require('gulp-typescript');
gulp.src('src/**/*.ts')
    .pipe(ts({
    noImplicitAny: true,
    out: 'output.js'
}))
    .pipe(gulp.dest('built/local'));
//# sourceMappingURL=gulpComplieTs.js.map