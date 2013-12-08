Angular.dart's dart2js Size
===========================

This tool tracks the size of the Javascript binary, minified and gzipped,
produced by dart2js.

The dart file fed into dart2js is here as main.dart.

We compile it using ```dart2js --minify main.dart -o main.dart.js && gzip -9 main.dart.js```

As of Dart 1,0 (r30798), that binary is 182KB minified and gzipped.

For comparison, the AngularJS 1.2.0 binary is 36KB, minified and gzipped.

To run
------
   * checkout Dart's standalone configuration into dart/standalone (TODO: make this a grunt task)
   * run ```grunt build_dart:<rev>```
   * run ```grunt build_angular:<rev>```
   * run ```grunt dart2js```
   * check history.json for the size of the output in bytes.

Help out
--------

We want your help, especially if you can make update @MirrorsUsed in main.dart to generate
a smaller binary.
