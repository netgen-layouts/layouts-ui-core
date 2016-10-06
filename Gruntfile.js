// Generated on 2013-07-23 using generator-webapp 0.2.6
'use strict';

/* OVERRIDE HANDLEBARS DEFAULT NAME LOOKUP ========================================================================================================*/
var Handlebars = require('handlebars/lib/index');
var JavaScriptCompiler = Handlebars.JavaScriptCompiler;

var helpers = require('./app/scripts/helpers');

var known_helpers = {};
for (var k in helpers) {
  known_helpers[k] = true;
}
//console.log("KNOWN HELPERS", known_helpers);


JavaScriptCompiler.prototype.nameLookup = function(parent, name /* , type*/ ) {
  return "Handlebars.r(" + parent + ",'" + name + "')";
};

/* OVERRIDE HANDLEBARS DEFAULT NAME LOOKUP ========================================================================================================*/


// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'


var VENDOR_FILES = ['jquery', 'underscore', 'backbone', 'backbone.localstorage'];

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var config = {
    app: 'app',
    dist: 'dist'
  };


  grunt.initConfig({
    yeoman: config,
    pkg: grunt.file.readJSON('package.json'),


    watch: {
      browserify: {
        files: ['<%= yeoman.app %>/scripts/**/*.js'],
        tasks: ['browserify:dev']
      },
      handlebars: {
        files: ['<%= yeoman.app %>/templates/**/*.hbs', 'tests/templates/**/*.hbs'],
        tasks: ['handlebars']
      }
    },


    browserSync: {
      bsFiles: {
        src: ['.tmp/scripts/*', 'app/*html']
      },
      options: {
        open: false,
        watchTask: true,
        server: {
          baseDir: ['.tmp', config.app]
        }
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },



    handlebars: {
      compile: {
        files: {
          '<%= yeoman.app %>/scripts/templates.js': '<%= yeoman.app %>/templates/**/*.hbs'
        },
        options: {
          compilerOptions: {
            knownHelpers: known_helpers,
            knownHelpersOnly: true
          },
          commonjs: true,
          wrapped: true,
          processPartialName: function(filename) {
            return filename
              .replace(/^app\/templates\//, '')
              .replace(/_(\w+)\.hbs$/, '$1');
          },
          processName: function(filename) {
            // funky name processing here
            return filename
              .replace(/^app\/templates\//, '')
              .replace(/\.hbs$/, '');
          }
        }
      }
    },


    uglify: {
      dist: {
        options: {
          compress: {
            drop_console: true
          }
        },
        src: '<%= yeoman.dist %>/scripts/main.js',
        dest: '<%= yeoman.dist %>/scripts/main.min.js'
      }
    },

    browserify: {

      vendor: {
        src: [],
        dest: '.tmp/scripts/vendor.js',
        options: {
          debug: true,
          require: VENDOR_FILES
        }
      },

      dev: {
        src: ['<%= yeoman.app %>/scripts/main.js'],
        dest: '.tmp/scripts/main.js',
        options: {
          debug: true,
          external: VENDOR_FILES,
          browserifyOptions: {
            debug: true
          },
          alias: {
           'core': './app/scripts/core'
          }
        }
      },

      dist: {
        src: ['<%= yeoman.app %>/scripts/main.js'],
        dest: '<%= yeoman.dist %>/scripts/main.js',
        options: {
          browserifyOptions: {
            debug: true
          },
          alias: {
            'core': './app/scripts/core'
          }
        }
      }

    },


    concat: {
      dist: {
        src: ['.tmp/scripts/vendor.js', '.tmp/scripts/main.js'],
        dest: '.tmp/out.js',
      },
    },


    concurrent: {
      server: [
        'handlebars',
        'browserify:dev',
        'browserify:vendor'
      ],

      test: [],

      dist: [
        'handlebars',
        'browserify:dist'
      ]
    }



  });

  grunt.registerTask('server', function() {

    grunt.task.run([
      'fast_build',
      'browserSync',
      'watch'
    ]);
  });

  grunt.registerTask('fast_build', function() {
    grunt.task.run([
      'clean:server',
      'concurrent:server'
    ]);
  });


  grunt.registerTask('build', function() {
    grunt.task.run([
      'clean:dist',
      'gitinfo',
      'concurrent:dist',
      'uglify:dist'
    ]);
  });


  grunt.registerTask('default', [
    'server'
  ]);

};
