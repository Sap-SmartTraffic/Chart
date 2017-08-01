var gulp = require('gulp');
const exec = require("child_process").exec;
const spawn = require('child_process').spawn;
const browserSync = require('browser-sync')
const less = require('gulp-less');
const ts = require('gulp-typescript');
const concat = require('gulp-concat');
const merge = require('merge2')
const clean = require('gulp-clean');
var fs=require("fs")
var tasksPath="./tasks"
fs.readdirSync(tasksPath).filter(f=>f.match(/js$/)).forEach(f=>require(tasksPath+'/'+f)(gulp))
// var exec = require("child_process").exec;
// var spawn = require('child_process').spawn;
// const browserSync = require('browser-sync').create();
// var less = require('gulp-less');
// var ts = require('gulp-typescript');
// var concat = require('gulp-concat');
// var merge = require('merge2')
// var clean = require('gulp-clean');
// var requirejsOptimize = require('gulp-requirejs-optimize')

// gulp.task('start', function () {
//     // exec("python -m http.server 8000",function(err,out,errstd){
//     //   console.log(out);
//     // })
//     // var ls   = spawn("tsc",["-w"], {stdio : "inherit"});
//     browserSync.init({
//         server: {
//             baseDir: "./",
//             index: "dist/index.html"
//         }
//     });
//     gulp.watch("./dist/*.*", function (e) {
//         browserSync.reload();
//         console.log(e.path + "-------file changed")

//     });
//     gulp.src('./src/**/*.html', {
//         base: "src"
//     }).pipe(gulp.dest('./dist/'))
//     gulp.watch("./src/**/*.html", function (e) {
//         gulp.src(e.path, {
//             base: "src"
//         }).pipe(gulp.dest('./dist/'))
//         console.log(e.path + "-------file copy")
//     })
//     gulp.watch("./src/**/*.less", function (e) {
//         gulp.src(e.path, {
//                 base: "src"
//             })
//             .pipe(less())
//             .pipe(gulp.dest("./dist/"))
//     })

// });


// gulp.task("copyHTML", function () {
//     gulp.src('./src/**/*.html', {
//         base: "src"
//     }).pipe(gulp.dest('./dist/'))
//     gulp.watch("./src/**/*.html", function (e) {
//         gulp.src(e.path, {
//             base: "src"
//         }).pipe(gulp.dest('./dist/'))
//         browserSync.reload();
//     })
//     console.log("copying")
// })



// gulp.task("clean",()=>{
//     gulp.src('dist_new', {read: false})
//         .pipe(clean({force: true}));
// })
// gulp.task("doinit",()=>{
//     gulp.src('src_new/**/*.ts',{base:"src_new"}).pipe(ts({
//         "target":'es5',
//         "module":"amd",
//     })).pipe(gulp.dest("./dist_new"))
//     gulp.src(['./src_new/**/*.html', './src_new/**/*.js', './src_new/**/*.css'], {
//         base: "src_new"
//     }).pipe(gulp.dest('./dist_new/'))
//     gulp.src("./src_new/**/*.less", {
//             base: "src_new"
//         })
//         .pipe(less())
//         .pipe(gulp.dest("./dist_new/"))
// })
// gulp.task("initServer",["doinit"],()=>{
//      browserSync.init({
//         server: {
//             baseDir: "./",
//             index: "dist_new/index.html"
//         },
//         port: 3100,
//     });
// })
// gulp.task('start_new',["initServer"], function () {

//     gulp.watch(["./src_new/**/*.html", "./src_new/**/*.js"], function (e) {
//         gulp.src(e.path, {
//             base: "src_new"
//         }).pipe(gulp.dest('./dist_new/'))
//         console.log(e.path + "-------file copy")
//     })
//     gulp.watch("./src_new/**/*.less", function (e) {
//         console.log("less changed")
//         gulp.src(e.path, {
//                 base: "src_new"
//             })
//             .pipe(less())
//             .pipe(gulp.dest("./dist_new/"))
//     })
//     gulp.watch("src_new/**/*.ts", {
//         cwd: './'
//     }, (f) => {
//         gulp.src(f.path, {
//                 base: "src_new"
//             })
//             .pipe(ts({
//                 "target": "es5",
//                 "module": "amd",
//             })).pipe(gulp.dest('./dist_new'))
//     })
   
// });


// gulp.task("bundle", function () {
//     var tsResult = gulp.src('src_new/CustomizedChart/Vicroad/VicroadChart.ts')
//         .pipe(ts({
//             declaration: true,
//             outFile: "VicroadChart.js",
//             module: "amd"
//         }));
//     var css = gulp.src('src_new/CustomizedChart/Vicroad/VicroadChart.less');
//     return merge([
//         tsResult.dts.pipe(gulp.dest('release/Vicroad')),
//         tsResult.js.pipe(gulp.dest('release/Vicroad')),
//         css.pipe(less()).pipe(gulp.dest('release/Vicroad'))
//     ]);
// })
//'./dist_new/CustomizedChart/Vicroad/VicroadChart.js',
// gulp.task("script",function(){
//    return gulp.src("./dist_new/CustomizedChart/Vicroad/VicroadChart.js").pipe(requirejsOptimize({
//      paths: {
//         d3: "empty:",
//         underscore:"empty:"
//     },
//      optimize: 'none',
//    }))
//     .pipe(gulp.dest('./release/')); 
// })
 
