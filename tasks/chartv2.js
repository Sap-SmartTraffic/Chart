const exec = require("child_process").exec;
const spawn = require('child_process').spawn;
const browserSync = require('browser-sync')
const less = require('gulp-less');
const ts = require('gulp-typescript');
const concat = require('gulp-concat');
const merge = require('merge2')
const clean = require('gulp-clean');
const chartV2server = browserSync.create()
module.exports = function (gulp) {
   
    gulp.task("chartV2Clean", () => {
        gulp.src("distChartV2", { read: false }).pipe(clean({ force: true }))
    })
    gulp.task("chartV2InitFile", () => {
        let basePath="chartV2"
        let baseDist="./distChartV2"
        let tsSteam = gulp.src(`./${basePath}/**/*.ts`, { base: basePath })
            .pipe(ts.createProject('tsconfig.json')())
            .pipe(gulp.dest(baseDist))
        let lessSteam=gulp.src(`./${basePath}/**/*.less`,{base:basePath})
            .pipe(less())
            .pipe(gulp.dest(baseDist))
        let staticSteam=gulp.src([`./${basePath}/**/*.html`,`./${basePath}/**/*.js`,`./${basePath}/**/*.css`,`./${basePath}/**/*.svg`,`./${basePath}/**/*.jpg`,`./${basePath}/**/*.png`],{base:basePath})
            .pipe(gulp.dest(baseDist))
        return merge([tsSteam,lessSteam,staticSteam])
    })
    gulp.task("copyV2",()=>{
        gulp.src(`./chartV2/**/*.html`,{base:baseDist})
            .pipe(gulp.dest("./distChartV2"))
    })
    gulp.task("chartV2InitServer",["chartV2InitFile"],()=>{
        chartV2server.init({
            server:{
                baseDir:"./",
                index:"distChartV2/index.html"
            },
            port:3200
            
        })
    })
    gulp.task("chartV2Watcher",['chartV2InitServer'],()=>{
        let basePath="chartV2"
        let baseDist="./distChartV2"
        gulp.watch([`**/*.html`,`**/*.js`,`**/*.css`,`**/*.svg`,`**/*.jpg`,`**/*.png`],{cwd:`./${basePath}/`},(e)=>{
            console.log(e)
            gulp.src(e.path,{base:basePath}).pipe(gulp.dest(baseDist))
        })
        gulp.watch(`**/*.less`,{cwd:`./${basePath}/`},(e)=>{
             console.log(e)
            gulp.src(e.path,{base:basePath}).pipe(less()).pipe(gulp.dest(baseDist))
        })
        gulp.watch(`**/*.ts`,{cwd:`./${basePath}/`},(e)=>{
             console.log(e)
            gulp.src(e.path,{base:basePath})
                .pipe(ts.createProject('tsconfig.json')())
                .pipe(gulp.dest(baseDist))
        })
    })
    gulp.task("chartV2Start",["chartV2Watcher"])

}
