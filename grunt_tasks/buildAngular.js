module.exports = function (grunt) {
  grunt.registerTask(
    'buildAngular',
    'Build Angular at a given SHA',
    func);

  return func;

  function func () {
    var q = require('q'),
        path = require('path'),
        deferred = q.defer(),
        done = this.async ? this.async() : function() {};

    process.nextTick(function () {
      grunt.log.warn('running task');
      deferred.resolve();
      done();
    });

    return deferred.promise;
  }
}; 
