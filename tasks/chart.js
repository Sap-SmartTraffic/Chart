const exec = require("child_process").exec;
const spawn = require('child_process').spawn;
const browserSync = require('browser-sync')
const less = require('gulp-less');
const ts = require('gulp-typescript');
const concat = require('gulp-concat');
const merge = require('merge2')
const clean = require('gulp-clean');
const server=browserSync.create()
module.exports=function(gulp){
    gulp.task("clean",()=>{
    gulp.src('dist_new', {read: false})
        .pipe(clean({force: true}));
})
gulp.task("doinit",()=>{
    gulp.src('src_new/**/*.ts',{base:"src_new"}).pipe(ts({
        "target":'es5',
        "module":"amd",
    })).pipe(gulp.dest("./dist_new"))
    gulp.src(['./src_new/**/*.html', './src_new/**/*.js', './src_new/**/*.css'], {
        base: "src_new"
    }).pipe(gulp.dest('./dist_new/'))
    gulp.src("./src_new/**/*.less", {
            base: "src_new"
        })
        .pipe(less())
        .pipe(gulp.dest("./dist_new/"))
})
gulp.task("initServer",["doinit"],()=>{
     server.init({
        server: {
            baseDir: "./",
            index: "dist_new/index.html"
        },
        port: 3100,
    });
})
gulp.task('start_new',["initServer"], function () {

    gulp.watch(["./src_new/**/*.html", "./src_new/**/*.js"], function (e) {
        gulp.src(e.path, {
            base: "src_new"
        }).pipe(gulp.dest('./dist_new/'))
        console.log(e.path + "-------file copy")
    })
    gulp.watch("./src_new/**/*.less", function (e) {
        console.log("less changed")
        gulp.src(e.path, {
                base: "src_new"
            })
            .pipe(less())
            .pipe(gulp.dest("./dist_new/"))
    })
    gulp.watch("src_new/**/*.ts", {
        cwd: './'
    }, (f) => {
        gulp.src(f.path, {
                base: "src_new"
            })
            .pipe(ts({
                "target": "es5",
                "module": "amd",
            })).pipe(gulp.dest('./dist_new'))
    })
   
});
gulp.task("bundle", function () {
    var tsResult = gulp.src('src_new/CustomizedChart/Vicroad/VicroadChart.ts')
        .pipe(ts({
            declaration: true,
            outFile: "VicroadChart.js",
            module: "amd"
        }));
    var css = gulp.src('src_new/CustomizedChart/Vicroad/VicroadChart.less');
    return merge([
        tsResult.dts.pipe(gulp.dest('release/Vicroad')),
        tsResult.js.pipe(gulp.dest('release/Vicroad')),
        css.pipe(less()).pipe(gulp.dest('release/Vicroad'))
    ]);
})
}
