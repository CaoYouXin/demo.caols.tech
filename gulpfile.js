
const gulp = require('gulp');
const exec = require('child_process').exec;
// const clean = require('gulp-clean');
const codeTransform = require('./codeTransform.js');

gulp.task('default', function() {
    const path = './hive/vue/src/components/UserChart.vue';

    gulp.src(path)
        .pipe(codeTransform(path))
        .pipe(gulp.dest('./tmp'));
});
