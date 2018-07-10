'use strict';

// Override Handlebars default name lookup
var Handlebars = require('handlebars/lib/index');
var JavaScriptCompiler = Handlebars.JavaScriptCompiler;
var _ = require('underscore');

var helpers = require('./app/scripts/helpers');

var known_helpers = {};
for (var k in helpers) {
  known_helpers[k] = true;
}

JavaScriptCompiler.prototype.nameLookup = function(parent, name /* , type*/ ) {
  return "Handlebars.r(" + parent + ",'" + name + "')";
};

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var config = {
    app: 'app',
    dist: 'bundle/Resources/public',
    dev: 'bundle/Resources/public/dev'
  };

  var pkg = grunt.file.readJSON('package.json');

  // We don't want to include bootstrap-sass assets since we handpick Bootstrap
  // components from the main "bootstrap" package
  var VENDOR_FILES = _.without(Object.keys(pkg.dependencies), 'bootstrap-sass');

  grunt.initConfig({
    config: config,

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
      server: '<%= config.dev %>'
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
           '@netgen/layouts-core-ui': './app/scripts/core'
          }
        }
      }
    },

    concurrent: {
      server: [
        'sass:server',
        'handlebars',
        'browserify:dev',
        'browserify:vendor'
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
    grunt.log.write('Not for standalone usage. Use the default grunt task.');
  });

  grunt.registerTask('default', [
    'server'
  ]);
};
