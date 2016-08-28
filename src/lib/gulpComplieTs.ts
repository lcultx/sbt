import * as gulp from 'gulp'
import * as ts from 'gulp-typescript'

gulp.src('src/**/*.ts')
    .pipe(ts({
        noImplicitAny: true,
        out: 'output.js'
    }) as any)
    .pipe(gulp.dest('built/local'));