module.exports = function (grunt) {
      grunt.registerAlias = function(name, tasks) {
        grunt.registerTask(name, function(target) {
          var suffix = !!target ? ':' + target : '';
          grunt.task.run.apply(grunt.task, tasks.map(function(task) {
            return task + suffix;
          }));
        });
      };

      grunt.addCmd = function addCmd(name, command) {
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
      };

      grunt.loadNpmTasks('grunt-shell');
      require('./grunt_tasks/buildDart')(grunt);
      require('./grunt_tasks/buildAngular')(grunt);
      require('./grunt_tasks/dart2js')(grunt);
      require('./grunt_tasks/testApp')(grunt);
      require('./grunt_tasks/updateReport')(grunt);
      require('./grunt_tasks/collate')(grunt);


}
