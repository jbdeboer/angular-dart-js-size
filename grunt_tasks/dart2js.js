module.exports = function (grunt) {
  grunt.addCmd('pub_install', 'pub install');
  grunt.addCmd('dart2js', function() {
    var r_dir = 'dart_versions/current';
    return r_dir + '/dart ' + r_dir + '/sdk/lib/_internal/compiler/implementation/dart2js.dart --minify main.dart -o main.dart.js';
  });

  grunt.registerTask(
      'updateHistory',
      'Updates the history file with the latest data',
      function updateHistory() {
        var history = grunt.file.readJSON('history.json');
        var lastSize = grunt.file.read('dart2jssize').split('\n')[0];
        var dartRev = grunt.file.read('dart_versions/CURRENT_VERSION').split('\n')[0];
        history.push({
          versions: {
            dart: dartRev
          },
          size: lastSize
        });
        grunt.file.write('history.json', JSON.stringify(history, null, 4));
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
