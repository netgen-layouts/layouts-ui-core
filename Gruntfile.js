// Generated on 2013-07-23 using generator-webapp 0.2.6
'use strict';

/* OVERRIDE HANDLEBARS DEFAULT NAME LOOKUP ========================================================================================================*/
var Handlebars = require('handlebars/lib/index');
var JavaScriptCompiler = Handlebars.JavaScriptCompiler;
var _ = require('underscore');

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



module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var config = {
    app: 'app',
    dist: 'Resources/public',
    dev: 'Resources/public/dev'
  };

  var pkg = grunt.file.readJSON('package.json');

  var VENDOR_FILES = _.without(Object.keys(pkg.dependencies), 'ace-builds', 'alloyeditor');

  grunt.initConfig({
    config: config,
    pkg: grunt.file.readJSON('package.json'),


    watch: {
      browserify: {
        files: ['<%= config.app %>/scripts/**/*.js'],
        tasks: ['browserify:dev']
      },
      sass: {
        files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'postcss:server']
      },
      handlebars: {
        files: ['<%= config.app %>/templates/**/*.hbs', 'tests/templates/**/*.hbs'],
        tasks: ['handlebars']
      }
    },


    browserSync: {
      bsFiles: {
        src: ['<%= config.dev %>/js/*', '<%= config.dev %>/styles/*.css', 'app/*html']
      },
      options: {
        open: false,
        watchTask: true,
        server: {
          baseDir: ['<%= config.dev %>', config.app]
        }
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.dev %>',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/vendor',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      vendor: [
        '<%= config.dist %>/vendor/ace-editor',
        '<%= config.dist %>/vendor/alloy-editor'
      ],
      server: '<%= config.dev %>'
    },


    copy: {

      vendor: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/ace-builds/src-min-noconflict',
            src: '**',
            dest: '<%= config.dist %>/vendor/ace-editor'
          },
          {
            expand: true,
            cwd: 'node_modules/alloyeditor/dist/alloy-editor',
            src: '**',
            dest: '<%= config.dist %>/vendor/alloy-editor'
          }
        ]
      }

    },



    handlebars: {
      compile: {
        files: {
          '<%= config.app %>/scripts/templates.js': '<%= config.app %>/templates/**/*.hbs'
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


    sass: {
      options: {
        includePaths: ['.']
      },
      server: {
        options: {
          sourceMap: true,
          sourceMapEmbed: true,
          sourceMapContents: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '<%= config.dev %>/styles',
          ext: '.css'
        }]
      },
      dist: {
        options: {
          sourceMap: false,
          sourceMapEmbed: false,
          sourceMapContents: false,
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '<%= config.dist %>/css',
          ext: '.css'
        }]
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: 'last 3 versions'})
        ]
      },
      server: {
        src: '<%= config.dev %>/styles/*.css'
      },

      dist: {
        src: '<%= config.dist %>/css/*.css'
      }
    },



    browserify: {

      vendor: {
        src: [],
        dest: '<%= config.dev %>/js/vendor.js',
        options: {
          require: VENDOR_FILES
        }
      },

      dev: {
        src: ['<%= config.app %>/scripts/main.js'],
        dest: '<%= config.dev %>/js/main.js',
        options: {
          external: VENDOR_FILES,
          browserifyOptions: {
            debug: true
          },
          alias: {
           'netgen-core': './app/scripts/core'
          }
        }
      },

      dist: {
        src: ['<%= config.app %>/scripts/main.js'],
        dest: '<%= config.dist %>/js/<%= pkg.name %>.js',
        options: {
          browserifyOptions: {
            debug: true
          },
          alias: {
            'netgen-core': './app/scripts/core'
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
        src: '<%= config.dist %>/js/<%= pkg.name %>.js',
        dest: '<%= config.dist %>/js/<%= pkg.name %>.js'
      }
    },



    concurrent: {
      server: [
        'sass:server',
        'handlebars',
        'browserify:dev',
        'browserify:vendor'
      ],

      test: [],

      dist: [
        'sass:dist',
        'handlebars',
        'browserify:dist',
        'copy:vendor'
      ]
    }



  });


  grunt.registerTask('npm_to_vendor', [
    'clean:vendor',
    'copy:vendor'
  ]);

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
