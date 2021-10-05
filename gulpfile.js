// dependencies 
const
	gulp = require('gulp'),
	autoprefixer = require('autoprefixer'),
	browserSync = require('browser-sync'),
	minifyCss = require('gulp-clean-css'),
	minifyHtml = require('gulp-minify-html'),
	postcss = require('gulp-postcss'),
	pug = require('gulp-pug'),
	sass = require('gulp-sass')(require('sass')),
	sourcemaps = require('gulp-sourcemaps')

const paths = {
	css: {
		src: './src/sass/**/*.scss',
		comp: './src/css/**/*.css',
		dest: './src/css',
		dist: './dist/css',
		maps: './'
	},
	html: {
		src: './src/pug/**/*.pug',
		comp: './src/**/*.html',
		dest: './src',
		dist: './dist'
	},
	assets: {
		src: './src/assets/**/*',
		dist: './dist/assets'
	}
}

// default task: help
function help(cb){
	console.log(`
The following commands are available in this application: 

gulp watch	- watch files for changes and recompile code
gulp sync	- watch files for changes, recompile code, and reload browser
gulp build	- compile and minify files for distribution
`)
	cb()
}

// build css
function buildCss(){
	return gulp.src(paths.css.src)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([autoprefixer()]))
		.pipe(sourcemaps.write(paths.css.maps))
		.pipe(gulp.dest(paths.css.dest))
		.pipe(browserSync.stream())
}

// build html
function buildHtml(){
	return gulp.src(paths.html.src)
		.pipe(pug())
		.pipe(gulp.dest(paths.html.dest))
		.pipe(browserSync.stream())
}

// distribute css
async function distributeCss(){
	return gulp.src(paths.css.comp)
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest(paths.css.dist))
}

// distribute html
async function distributeHtml(){
	return gulp.src(paths.html.comp)
		.pipe(minifyHtml())
		.pipe(gulp.dest(paths.html.dist))
}

// distribute assets
function distributeAssets(){
	return gulp.src(paths.assets.src)
		.pipe(gulp.dest(paths.assets.dist))
}

// watch files for changes
function watch(){
	gulp.watch(paths.css.src, buildCss)
	gulp.watch(paths.html.src, buildHtml)
	gulp.watch(paths.assets.src, browserSync.reload())
}

// sync browser and watch for changes
function sync(){
	browserSync.init({
		server: {
			baseDir: './src'
		}
	})

	watch()
}

const build = gulp.series(buildCss, buildHtml, distributeCss, distributeHtml, distributeAssets)

exports.default = help
exports.build = build
exports.sync = sync
exports.watch = watch