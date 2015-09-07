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
            src: "node_modules/codemirror/lib/codemirror.css",
            dest: ".cache/scss/_codemirror.scss"
          },
          {
            src: "node_modules/codemirror/theme/base16-light.css",
            dest: ".cache/scss/_codemirror-theme.scss"
          }
        ],
      },
      distribution: {
        files: [
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
          "node_modules"
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

    // browserify
    browserify: {
      build: {
        files: [
          {
            src: "src/js/jquery-editor.js",
            dest: "dist/jquery-editor.js"
          }
        ]
      }
    },

    // Watch
    watch: {
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
        tasks: [ "development" ]
      },

      browserify: {
        files: "src/js/**/*.js",
        tasks: [ "jshint:build", "browserify:build" ]
      }

    }

  });

  // Tasks

  // Development task
  grunt.registerTask( "development", [
    "jshint",
    "clean",
    "copy:prepare",
    "fontello",
    "compass:development",
    "copy:distribution",
    "browserify:build",
    "watch"
  ] );

  // Build task
  grunt.registerTask( "build", [
    "jshint",
    "clean",
    "copy:prepare",
    "fontello",
    "compass:build",
    "copy:distribution",
    "browserify:build"
  ] );

  // Default task
  grunt.registerTask( "default", [ "build" ] );

};
