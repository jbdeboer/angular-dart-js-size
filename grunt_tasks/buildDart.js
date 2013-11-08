module.exports = function (grunt) {


  var deps_url = 'http://dart.googlecode.com/svn/branches/bleeding_edge/deps/standalone.deps';
  var gclient_path = '../depot_tools/gclient';
  var cd_dart = 'cd dart/standalone && ';
  var cd_dart_dart = 'cd dart/standalone/dart && ';

  grunt.addCmd('setup_dart_dir',
      'if [ ! -d dart/ ]; then ' +
        'mkdir -p dart/standalone; ' +
        'cd dart; ' +
        'svn co http://src.chromium.org/svn/trunk/tools/depot_tools; ' +
      'fi');

  grunt.addCmd('sync_deps', '(' + cd_dart + gclient_path + ' config ' + deps_url + ')');
  grunt.addCmd('sync_dart', function(rev) {
    var revArg = rev ? ' --revision=' + rev : '';
    // This checks out dart twice, but the gclient scripts seems to be buggy.
    return '(' + cd_dart + gclient_path + ' sync -n ' + revArg + ') && ' +
        '(' + cd_dart_dart + 'svn update' + revArg + ') && ' +
        cd_dart + gclient_path + ' runhooks';
  });
  grunt.addCmd('build_dart', cd_dart_dart + './tools/build.py -m release -a x64');
  grunt.addCmd('cp_build', function(rev) {
    rev = rev || 'head';
    var r_dir = 'dart_versions/' + rev;
    return 'rm -rf ' + r_dir + ' && ' +
        'mkdir -p ' + r_dir + ' && ' +
        'cp dart/standalone/dart/out/ReleaseX64/dart ' + r_dir + ' && ' +
        'cp -a dart/standalone/dart/sdk ' + r_dir + ' && ' +
        'rm -f dart_versions/current && ' +
        'ln -s dart_versions/' + rev + ' current && ' +
        'echo "' + rev + '" > dart_versions/CURRENT_VERSION';
  });


  grunt.registerAlias('build_dart', [
    'shell:setup_dart_dir',
    'shell:sync_deps',
    'shell:sync_dart',
    'shell:build_dart',
    'shell:cp_build'
  ]);
};
