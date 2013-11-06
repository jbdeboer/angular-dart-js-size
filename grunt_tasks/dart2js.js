module.exports = function (grunt) {
  var dart = 'dart_versions/current/dart --package-root=dart_versions/current/packages/';
  var pub = dart + ' ' +
      'dart_versions/current/sdk/lib/_internal/pub/bin/pub.dart';


  grunt.addCmd('pub_install', 'cp angular.dart/pubspec.lock . && ' + pub + ' install');
  grunt.addCmd('dart2js', function(opts) {
    var minify = (opts && opts.indexOf('nomin') != -1) ? '' : '--minify ';
    var r_dir = 'dart_versions/current';
    return dart + ' ' + r_dir + '/sdk/lib/_internal/compiler/implementation/dart2js.dart ' + minify + ' main.dart -o main.dart.js';
  });

  grunt.registerTask(
      'updateHistory',
      'Updates the history file with the latest data',
      function updateHistory() {
        var history = grunt.file.readJSON('history.json');
        var lastSize = grunt.file.read('dart2jssize').split('\n')[0];
        var dartRev = grunt.file.read('dart_versions/CURRENT_VERSION').split('\n')[0];
        var angularRev = grunt.file.read('angular.dart/CURRENT_VERSION').split('\n')[0];
        history.push({
          versions: {
            dart: dartRev,
            angular: angularRev
          },
          size: lastSize
        });
        grunt.file.write('history.json', JSON.stringify(history, null, 4));
        console.log('dart2js size: ' + lastSize);
      });

  grunt.addCmd('updateReport', function() {
    return 'gzip -f main.dart.js && ' +
        'wc -c main.dart.js.gz | cut -d\' \' -f1 >dart2jssize';
  });

  grunt.registerAlias('dart2js', [
    'shell:pub_install',
    'shell:dart2js',
    'testApp',
    'shell:updateReport',
    'updateHistory'
  ])
}; 
