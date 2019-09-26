const gulp = require('gulp')
const imagemin = require('gulp-imagemin')
const imageminJpg = require('imagemin-jpeg-recompress')
const imageminPng = require('imagemin-pngquant')
const imageminGif = require('imagemin-gifsicle')

const jimp = require('jimp')
const fs = require('fs')

const dir = require('./setting')

const paths = {
  src: dir.src,
  int: 'int',
  dst: dir.dst
}

gulp.task('imgcover', function () {
  fs.readdir(paths.src, function (err, files) {
    if (err) {
      throw err
    }
    files
      .filter((item) =>
        !item.match(/\.DS_Store/))
      .forEach((item) => {
        let itemName = item.substr(0, item.lastIndexOf('.')) + '.png'

        jimp.read(paths.src + '/' + item).then(function (img) {
          // pc
          img
            .contain(1200, 500)
            .write(paths.int + '/pc_' + itemName)
        }).catch(function (err) {
          console.log(item)
          console.error(err)
        })
        jimp.read(paths.src + '/' + item).then(function (img) {
          // sp
          img
            .contain(450, 450)
            .write(paths.int + '/sp_' + itemName)
        }).catch(function (err) {
          console.log(item)
          console.error(err)
        })
        jimp.read(paths.src + '/' + item).then(function (img) {
          // mirror
          img
            .scaleToFit(450, 2000)
            .write(paths.int + '/top_' + itemName)
        }).catch(function (err) {
          console.log(item)
          console.error(err)
        })
      })
  })

  return gulp.src(paths.src)
})

gulp.task('imagemin', function () {
  let srcGlob = paths.int + '/*.+(jpg|jpeg|png|gif)'
  let dstGlob = paths.dst
  return gulp.src(srcGlob)
    .pipe(imagemin([
      imageminGif(),
      imageminJpg(),
      imageminPng({
        optimizationLevel: 5
      })
    ]))
    .pipe(gulp.dest(dstGlob))
})