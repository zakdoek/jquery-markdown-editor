/**
 * Build file
 */

module.exports = function( grunt ) {

  "use strict";

  // Load the grunt tasks
  require( "load-grunt-tasks" )( grunt );

  // Time the grunt task
  require( "time-grunt" )( grunt );

  var pkg = require( "./package.json" );

  // Configuration
  grunt.initConfig({
    pkg: pkg,

    // Clean
    clean: {
      build: ["dist", ".cache" ]
    },

    // Copy
    copy: {
      prepare: {
        files: [
          {
            src: "bower_components/CodeMirror/lib/codemirror.css",
            dest: ".cache/scss/_codemirror.scss"
          },
          {
            src: "bower_components/CodeMirror/theme/base16-light.css",
            dest: ".cache/scss/_codemirror-theme.scss"
          }
        ],
      },
      bower: {
        files: [
          {
            src: "bower.json",
            dest: "dist/bower.json"
          },
          {
            expand: true,
            cwd: "src/scss",
            src: "**/*.scss",
            dest: "dist"
          },
          {
            src: ".cache/scss/_codemirror.scss",
            dest: "dist/_codemirror.scss"
          },
          {
            src: ".cache/scss/_codemirror-theme.scss",
            dest: "dist/_codemirror-theme.scss"
          },
          {
            src: ".cache/scss/_jquery-markdown-editor-codes.scss",
            dest: "dist/_jquery-markdown-editor-codes.scss"
          },
          {
            src: "src/fontello/config.json",
            dest: "dist/fontello.json"
          }
        ]
      }
    },

    // Fontello
    fontello: {
      build: {
        options: {
          scss: true,
          force: true,
          config: "src/fontello/config.json",
          fonts: "dist/fonts",
          styles: ".cache/scss"
        }
      }
    },

    // Compass
    compass: {
      options: {
        sassDir: "src/scss",
        relativeAssets: true,
        importPath: [
          ".cache/scss",
          "bower_components"
        ],
        cssDir: "dist",
        fontsDir: "dist/fonts"
      },

      development: {
        options: {
          outputStyle: "nested"
        }
      },

      build: {
        options: {
          outputStyle: "compressed"
        }
      }
    },

    // jshint
    jshint: {
      options: {
        jshintrc: true
      },

      gruntfile: {
        src: "Gruntfile.js"
      },

      build: {
        src: "src/js/**/*.js"
      }
    },

    // Requirejs
    requirejs: {
      options: {
        baseUrl: "bower_components",
        name: "jquery-markdown-editor/jquery-editor",
        paths: {
          "jquery-markdown-editor": "../src/js",

          // Exclude from source compilation
          "jquery": "empty:",
          "CodeMirror": "empty:",
          "marked": "empty:"
        }
      },

      development: {
        options: {
          optimize: "none",
          out: "dist/jquery-markdown-editor.js"
        }
      },

      build: {
        options: {
          optimize: "uglify2",
          out: "dist/jquery-markdown-editor.min.js"
        }
      }
    },

    // Release to bower
    "gh-pages": {
      bower: {
        base: "build",
        branch: "master",
        message: "Release v<%= pkg.version %>",
        repo: "https://github.com/zakdoek/jquery-markdown-editor-bower",
        tag: "<%= pkg.version %>"
      },
      src: "**/*"
    },

    // Watch
    watch: {
      bowerFile: {
        files: "bower.json",
        tasks: [ "copy:prepare", "copy:bower" ]
      },

      fontello: {
        files: [
          "src/fontello/config.json",
          "src/scss/_fontello.scss"
        ],
        tasks: [
          "fontello:build",
          "compass:development"
        ]
      },

      compass: {
        files: "src/scss/**/*.scss",
        tasks: [ "compass:development" ]
      },

      gruntfile: {
        files: "Gruntfile.js",
        tasks: [ "jshint:gruntfile" ]
      },

      requirejs: {
        files: "src/js/**/*.js",
        tasks: [ "jshint:build", "requirejs:development" ]
      }

    }

  });

  // Tasks
  grunt.registerTask( "development", [
    "jshint",
    "clean",
    "copy:prepare",
    "fontello",
    "compass:development",
    "requirejs:development",
    "copy:bower",
    "watch"
  ] );
  grunt.registerTask( "build", [
    "jshint",
    "clean",
    "copy:prepare",
    "fontello",
    "compass:build",
    "requirejs:development",
    "requirejs:build",
    "copy:bower"
  ] );
  grunt.registerTask( "release", [
    "build",
    "gh-pages:bower"
  ] );
  grunt.registerTask( "default", [ "build" ] );

};
