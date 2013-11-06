module.exports = function (grunt) {
      grunt.registerAlias = function(name, tasks) {
        grunt.registerTask(name, function(target) {
          if (target == null) {
            grunt.error(name + ' target must be specified, like ' + taskA + ':001.');
          }
          grunt.task.run.apply(grunt.task, tasks.map(function(task) {
            return task + ':' + target;
          }));
        });
      }

      grunt.loadNpmTasks('grunt-shell');
      require('./grunt_tasks/buildDart')(grunt);
      require('./grunt_tasks/buildAngular')(grunt);
      require('./grunt_tasks/dart2js')(grunt);
      require('./grunt_tasks/testApp')(grunt);
      require('./grunt_tasks/updateReport')(grunt);
      require('./grunt_tasks/collate')(grunt);


}
