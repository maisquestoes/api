require("copy-paste");

var inspect = require("util").inspect;
var fs = require("fs");
var shell = require("shelljs");

module.exports = function(grunt) {

  var task = grunt.task;
  var file = grunt.file;
  var log = grunt.log;
  var verbose = grunt.verbose;
  var fail = grunt.fail;
  var option = grunt.option;
  var config = grunt.config;
  var template = grunt.template;
  var _ = grunt.util._;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    nodeunit: {
      tests: [
        "test/lodashim.js"
      ]
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: false,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        strict: false,
        esnext: true,
        globals: {
          exports: true,
          document: true,
          $: true,
          Radar: true,
          WeakMap: true,
          window: true,
          copy: true
        }
      },
      files: {
        src: [
          "gruntfile.js",
          "*.js",
          "test/**/*.js",
        ]
      }
    },
    jscs: {
      files: {
        src: [
          "gruntfile.js",
          "*.js",
          "test/**/*.js",
        ]
      },
      options: {
        config: ".jscsrc",
        requireCurlyBraces: [
          "if",
          "else",
          "for",
          "while",
          "do",
          "try",
          "catch",
        ],
        disallowNewlineBeforeBlockStatements: true,
        requireSpaceBeforeBlockStatements: true,
        requireParenthesesAroundIIFE: true,
        requireSpacesInConditionalExpression: true,
        // requireSpaceBeforeKeywords: true,
        requireSpaceAfterKeywords: [
          "if", "else",
          "switch", "case",
          "try", "catch",
          "do", "while", "for",
          "return", "typeof", "void",
        ],
        validateQuoteMarks: {
          mark: "\"",
          escape: true
        }
      }
    },
    jsbeautifier: {
      files: ["*.js", "test/**/*.js"],
      options: {
        js: {
          braceStyle: "collapse",
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: " ",
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: false,
          keepArrayIndentation: false,
          keepFunctionIndentation: false,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          spaceBeforeConditional: true,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 0
        }
      }
    },
    watch: {
      src: {
        files: [
          "gruntfile.js",
          "*.js",
          "test/**/*.js",
        ],
        tasks: ["default"],
        options: {
          interrupt: true,
        },
      }
    }
  });

  // Support running a single test suite:
  // grunt nodeunit:just:motor for example
  grunt.registerTask("nodeunit:just", function(file) {
    if (file) {
      grunt.config("nodeunit.tests", [
        "test/" + file + ".js",
      ]);
    }

    grunt.task.run("nodeunit");
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks("grunt-jscs");

  grunt.registerTask("default", ["jshint", "jscs", "nodeunit"]);


  grunt.registerTask("bump", "Bump the version", function(version) {

    var pkg = grunt.file.read("package.json").split(/\n/).map(function(line) {
      var replacement, minor, data;

      if (/version/.test(line)) {
        data = line.replace(/"|,/g, "").split(":")[1].split(".");

        if (version) {
          replacement = version;
        } else {
          minor = +data[2];
          data[2] = ++minor;
          replacement = data.join(".").trim();
        }

        copy(replacement);

        return '  "version": "' + replacement + '",';
      }

      return line;
    });

    grunt.file.write("package.json", pkg.join("\n"));

  });
};
