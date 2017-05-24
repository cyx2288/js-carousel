var gulp = require('gulp'),

    less = require('gulp-less'),//less解码

    clean=require('gulp-clean-css'),//压缩css

    cheerio = require('gulp-cheerio'),//批量更换html中的引用

    autoprefixer = require('gulp-autoprefixer'),//css兼容性

    connect = require('gulp-connect'),//服务器

    uglify=require('gulp-uglify'),//js压缩

    rename = require("gulp-rename");//重命名



var config={

    css:{

        name:'address_select'

    },

    js:{

        name:'address_select'

    }

};



gulp.task('lessDev',  lessDev);

function lessDev() {

    gulp.src(['src/style/*.{less,css}']) //该任务针对的文件7

        .pipe(less()) //编译less

        .pipe(autoprefixer({
            browsers: ['Android >= 4.0', 'IOS >=7', 'Firefox >= 20', 'ie >= 8'],//兼容设备

            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(+45deg);

            remove: true //是否去掉不必要的前缀 默认：true
        }))

        .pipe(clean()) //压缩css

        .pipe(rename({

            basename: config.css.name,

            suffix: '.min'

        }))

        .pipe(gulp.dest('build/css')) //将会在build/css下生成index.css

        .pipe(connect.reload());

}

gulp.task('serverDev',  devServer);

    function devServer() {
    //
    connect.server({

        name: 'jiafu',//服务名称

        root: 'build',//目录

        port: 8001,//端口

        livereload: true//是否支持实时刷新

    });

}

gulp.task('htmlDev',devHtml);

function devHtml() {

    gulp.src(['src/view/*.html']) //该任务针对的文件7

        //增加媒体查询，通用样式文件
        .pipe(cheerio({

            run: function ($) {

                var addHtml = "";

                addHtml += "\n<link rel='stylesheet'  href='../css/"+config.css.name+".min.css'/>\n ";

                addHtml += "<script src='../js/"+config.js.name+".min.js'/></script>\n ";

                $('head').append(addHtml);

            },

            parserOptions: {
                // Options here
                decodeEntities: false
            }

        }))

        .pipe(gulp.dest('build/html')) //将会在build/css下生成index.css

        .pipe(connect.reload());

}

gulp.task('jsDev',devJs);

function devJs() {

    gulp.src(['src/script/*.js'])

        .pipe(uglify())

        .pipe(rename({

            basename: config.js.name,

            suffix: '.min'

        }))

        .pipe(gulp.dest('build/js'));

}

gulp.task('imgDev',devImg);

function devImg() {

    gulp.src('src/images/**/*.{png,jpg}')

        .pipe(gulp.dest('build/images'));

}

gulp.task('devWatch', function () {

    //less文件修改 ，注入css
    gulp.watch('src/style/*.{less,css}', ['lessDev']);

    //html,js文件修改，重新拼接，刷新
    gulp.watch(['src/script/*.js', 'src/view/*.html'], ["htmlDev",'jsDev']);

});


gulp.task('.myServer', ['htmlDev','imgDev', 'jsDev', 'lessDev','devWatch','serverDev']);