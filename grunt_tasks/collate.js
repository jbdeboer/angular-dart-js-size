var svnLogParser = require('svn-log-parser');

module.exports = function (grunt) {
  process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});
  console.log('listening...');

  grunt.registerTask(
      'fetchDartLog',
      'Fetch Dart logs and write them as JSON to a file.',
      func);

  return func;

  function func () {
    done = this.async ? this.async() : function() {};

    var history = grunt.file.readJSON('history.json');

    var lastRev = 0;
    history.forEach(function(run) {
      if (run.versions && run.versions.dart && run.versions.dart > lastRev) {
        lastRev = run.versions.dart;
      }
    });

    grunt.util.spawn({ cmd: 'svn', args: ['log', '-r' + lastRev + ':HEAD'], opts: {cwd: process.cwd() + '/dart/standalone/dart'}}, function(err, result) {
      if (err) { done(err); return; }
      var x = svnLogParser(function(results) {
        grunt.file.write('dartsvn.json', JSON.stringify(results));
        var nextDart = findNextDartVersion(grunt, results, lastRev);
        console.log(JSON.stringify(nextDart));
        grunt.task.run.apply(grunt.task, ['build_dart:' + nextDart.rev]);
        done();
      }, {}, result.stdout).end();
    });


  }
};

function findNextDartVersion(grunt, svnJson, lastRev) {
  var nextRev;
  for (var rev in svnJson.revs) {
    if (rev <= lastRev) continue;
    if (!nextRev) {
      nextRev = rev;
    }
    if (rev < nextRev) {
      nextRev = rev;
    }
  }

  var data = svnJson.revs[nextRev];
  return {
    type: "dart",
    rev: nextRev,
    time: new Date(data.timestamp)
  };
}
