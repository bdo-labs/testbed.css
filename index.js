
/**
 * Module dependencies.
 */

var Watcher = require('duo-watch');
var Duo = require('duo');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var myth = require('duo-myth');
var write = require('fs').writeFileSync;
var mkdir = require('mkdirp').sync;
var basename = require('path').basename;
var join = require('path').join;
var co = require('co');
var root = __dirname;

/**
 * Output directory.
 */

var build = join(root, 'build');

/**
 * Start a server.
 */

browserSync({ server: { baseDir: build } });

/**
 * File changes.
 */

Watcher(root).watch(function(file){
  console.log('changed: %s', file);
  var out = join(build, basename(file));

  // Transform
  var duo = Duo(__dirname)
    .entry(file)
    .use(myth());

  // Build & reload
  duo.run(function(err, str){
    err && console.error(err);
    mkdir(build);
    write(out, str);
    console.log('rebuilt: %s', file);
    reload();
  });
});

