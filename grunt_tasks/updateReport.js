module.exports = function (grunt) {
  grunt.registerTask(
    'updateReport',
    'Updates the report with the most recent data',
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
