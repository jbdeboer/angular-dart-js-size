var webdriver = require('selenium-webdriver');
var chromeservice = require('selenium-webdriver/chrome');
var chromedriver = require('chromedriver');

module.exports = function (grunt) {
  grunt.registerTask(
    'testApp',
    'Test the application for correctness',
    func);

  return func;

  function func (opts) {
    var noclose = (opts && opts.indexOf('noclose') != -1);
    var timeout = 1000;

    var q = require('q'),
        path = require('path'),
        deferred = q.defer(),
        done = this.async ? this.async() : function() {};

    chromeservice.setDefaultService(new chromeservice.ServiceBuilder(chromedriver.path).build());
    var driver = new webdriver.Builder().
        withCapabilities(webdriver.Capabilities.chrome()).
        build();

    function cleanup() {
      return driver.quit();
    }

    driver.controlFlow().addListener('uncaughtException',
        function(e) {
          console.log('Exception. Cleaning up.\n' + e);
          cleanup().then(function() { done(false); });
        });

    driver.get('file://' + process.cwd() + '/index.html');
    if (noclose) return;

// Wait for Angular.dart to load...
    driver.wait(function() {
      return driver.getTitle().then(function(title) {
        console.log('Title: ' + title);
        return title.indexOf('{') == -1;
      });
    }, timeout);


    driver.findElement(webdriver.By.id('in')).sendKeys('webdriver ');
    driver.wait(function() {
      return driver.getTitle().then(function(title) {
        console.log('Title: ' + title);
        return 'Hello webdriver' === title;
      });
    }, timeout);
//.then(function() { console.log('happy wait')}, function() { console.log('sad wait')});

    cleanup().then(function() { done(); });
  }
}; 
