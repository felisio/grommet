var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var coveralls = require('gulp-coveralls');
var blanket = require('gulp-blanket-mocha');

var gulpUtils = require('./gulpfile-utils');

var opts = {
  dist: path.resolve(__dirname, 'dist'),
  copyAssets: [
    'README.md',
    'src/js/**',
    {
      asset: 'src/scss/**',
      dist: 'dist/scss/'
    },
    {
      asset: 'src/utils/**',
      dist: 'dist/utils/'
    },
    'src/img/**',
    {
      asset: 'bin/**',
      dist: 'dist/bin/'
    },
    {
      asset: 'templates/**',
      dist: 'dist/templates/'
    },
    {
      asset: 'examples/**',
      dist: 'dist/examples/',
      ignores: [
        'node_modules/',
        'dist/'
      ]
    },
    {
      filename: 'package.json',
      asset: JSON.stringify(gulpUtils.getPackageJSON(), null, 2)
    },
    {
      asset: 'src/utils/gulp/.eslintrc',
      dist: 'dist/utils/gulp/'
    }
  ],
  scssAssets: ['src/scss/**/*.scss'],
  jsAssets: [
    'src/js/**/*.js',
    'src/utils/**/*.js',
    'test/**/*.js',
    'examples/cto-app-tuner/src/**/*.js',
    'examples/server/*.js'
  ],
  mainJs: 'src/js/index.js',
  mainScss: 'src/scss/grommet-core/index.scss',
  sync: {
    hostname: 'grommet.io',
    username: 'grommet',
    remoteDestination: '/var/www/html/assets/' + gulpUtils.getPackageJSON().version
  },
  webpack: {
    output: {
      filename: 'grommet.min.js',
      libraryTarget: 'var',
      library: 'Grommet'
    },
    resolve: {
      modulesDirectories: ['node_modules', 'src/js', 'src/scss']
    },
    externals: {
      'react': 'React'
    }
  },
  distPreprocess: ['dist-css'],
  scsslint: true,
  testPaths: [
    'test/**/*.js'
  ]
};

require('./src/utils/gulp/gulp-tasks')(gulp, opts);

require('./gulpfile-grommet-dist')(gulp, opts);
require('./gulpfile-grommet-release')(gulp, opts);

gulp.task('blanket-lcov-reporter', function(done) {
  require('./src/utils/test/test-compiler');
  require('./src/utils/test/mocked-dom')('<html><body></body></html>');

  gulp.src('./test/**/*.js', {
    read: false
  }).pipe(blanket({
    instrument: [path.join(__dirname, 'src/js')],
    captureFile: 'test/lcov.info',
    reporter: 'mocha-lcov-reporter'
  }));

  done();
});

gulp.task('coveralls', function() {
  var lcovPath = './test/lcov.info';
  fs.exists(lcovPath, function(exists) {
    if (exists) {
      gulp.src(lcovPath).pipe(coveralls());
    } else {
      console.error('Could not find lcov report file.');
      process.exit(1);
    }
  });
});

gulp.task('dev', function() {
  console.error('Running "gulp dev" at Grommet root folder is not supported. If you want to start the website, run "gulp dev" at docs folder');
});
