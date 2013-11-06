module.exports = function (grunt) {

  function addCmd(name, command) {
    grunt.config.set('shell.' + name, {
      command: command,
      options: {
        execOptions: {
          maxBuffer: 1024 * 1024 * 1024 // gB
        },
        failOnError: true,
        stderr: true,
        stdout: true
      }
    });
  }
  var deps_url = 'http://dart.googlecode.com/svn/branches/bleeding_edge/deps/standalone.deps';
  var gclient_path = '../depot_tools/gclient';
  var cd_dart = 'cd dart/standalone && ';
  var cd_dart_dart = 'cd dart/standalone/dart && ';

  addCmd('setup_dart_dir',
      'if [ ! -d dart/ ]; then ' +
        'mkdir -p dart/standalone; ' +
        'cd dart; ' +
        'svn co http://src.chromium.org/svn/trunk/tools/depot_tools; ' +
      'fi');

  addCmd('sync_deps', '(' + cd_dart + gclient_path + ' config ' + deps_url + ')');
  addCmd('sync_dart', function(rev) {
    var revArg = rev ? ' --revision=' + rev : '';
    // This checks out dart twice, but the gclient scripts seems to be buggy.
    return '(' + cd_dart + gclient_path + ' sync -n ' + revArg + ') && ' +
        '(' + cd_dart_dart + 'svn update' + revArg + ') && ' +
        cd_dart + gclient_path + ' runhooks';
  });
  addCmd('build_dart', cd_dart_dart + './tools/build.py -m release -a x64');
  addCmd('cp_build', function(rev) {
    rev = rev || 'head';
    var r_dir = 'dart_versions/' + rev;
    return 'rm -rf ' + r_dir + ' && ' +
        'mkdir -p ' + r_dir + ' && ' +
        'cp dart/standalone/dart/out/ReleaseX64/dart ' + r_dir + ' && ' +
        'cp -a dart/standalone/dart/sdk ' + r_dir;
  });
  addCmd('dart2js', function(rev) {
    var r_dir = 'dart_versions/' + rev;
    return r_dir + '/dart ' + r_dir + '/sdk/lib/_internal/compiler/implementation/dart2js.dart --minify main.dart -o main.dart.js';
  });
  addCmd('updateReport', function(rev) {
    var r_dir = 'dart_versions/' + rev;
    return 'gzip -f main.dart.js && ' +
        'mkdir -p reports/ && ' +
        'wc -c main.dart.js.gz | cut -d\' \' -f1 >reports/' + rev;
  });

  grunt.registerAlias('build_dart', [
    'shell:setup_dart_dir',
    'shell:sync_deps',
    'shell:sync_dart',
    'shell:build_dart',
    'shell:cp_build',
    'shell:dart2js',
    'testApp',
    'shell:updateReport'
  ]);
};
