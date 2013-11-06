module.exports = function (grunt) {
  var pub = '../dart_versions/current/dart --package-root=../dart_versions/current/packages/ ' +
      '../dart_versions/current/sdk/lib/_internal/pub/bin/pub.dart';

  grunt.addCmd('setup_angular_dir',
      'if [ ! -d angular.dart/ ]; then ' +
        'git clone https://github.com/angular/angular.dart.git; ' +
      'fi');

  grunt.addCmd('sync_angular', function(rev) {
    return 'cd angular.dart && ' +
        'git fetch --all && ' +
        'git reset --hard ' + rev + ' && ' +
        'echo "' + rev + '" >CURRENT_VERSION';
  });

  grunt.addCmd('build_angular',
      'cd angular.dart && ' + pub + ' install');

  grunt.registerAlias('build_angular', [
    'shell:setup_angular_dir',
    'shell:sync_angular',
    'shell:build_angular'
  ]);
};
