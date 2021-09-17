import { src, dest, watch } from 'gulp'
const cssimport = require('gulp-cssimport')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

export function buildSass() {
  return src('./assets/main.scss')
    .pipe(sass({ includePaths: 'node_modules' }).on('error', sass.logError))
    .pipe(
      cssimport({
        includePaths: ['node_modules/arcgis-js-api/themes'],
      }),
    )
    .pipe(dest('./dist'))
}

export function watchSass() {
  watch(['./assets/*.scss'], buildSass)
}
