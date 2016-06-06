module.exports = function(grunt) {

  'use strict';

  require('jit-grunt')(grunt, {
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    assemble: {
      options: {
        layout: 'default.html',
        layoutdir: 'source/templates/layouts',
        partials: 'source/templates/partials/**/*.html'
      },
      files: {
        expand: true,
        cwd: 'source/templates/mails',
        dest: 'build',
        src: '**/*.html'
      }
    },

    htmlmin: {
      options: {
        collapseWhitespace: true,
        keepClosingSlash: true
      },
      files: {
        expand: true,
        cwd: 'build',
        dest: 'build',
        src: '**/*.html',
      }
    },

    imagemin: {
      files: {
        expand: true,
        cwd: 'source/content/images',
        src: '**/*.{gif,ico,jpg,jpeg,png}',
        dest: 'build/content/images'
      }
    },

    mailgun: {
      newsLetter: {
        options: {
          key: '<API KEY>',
          sender: '<SENDER EMAIL>',
          recipient: [
            '<RECIPIENT EMAIL>'
          ],
          subject: 'This is a test email',
          preventThreading: true
        },
        src: ['build/index.html']
      }
    },

    postcss: {
      options: {
        map: {
          inline: false
        },
        processors: [
          require('postcss-import')(),
          require('postcss-cssnext')({
            features: {
              rem: false
            },
          })
        ]
      },
      target: {
        files: {
          'build/assets/css/style.css': ['source/assets/css/style.css']
        }
      }
    },

    premailer: {
      files: {
        expand: true,
        cwd: 'build',
        dest: 'build',
        src: '**/*.html',
      }
    },

    replace: {
      options: {
        patterns: [
          {
            match: 'content/images', // replace local content/images with server
            replacement: 'content/images'
          }
        ]
      },
      files: {
        expand: true,
        cwd: 'build',
        dest: 'build',
        src: '**/*.html',
      }
    },

    watch: {
      css: {
        files: ['source/assets/css/**/*.css'],
        tasks: ['postcss']
      },
      html: {
        files: ['source/templates/**/*.html'],
        tasks: ['assemble']
      },
      images: {
        files: ['source/content/images/**/*.{gif,jpg,jpeg,png}'],
        tasks: ['imagemin']
      }
    }

  });

  grunt.registerTask('default', [
    'assemble',
    'postcss',
    'imagemin',
    'watch'
  ]);

  grunt.registerTask('send', [
    'assemble',
    'postcss',
    'imagemin',
    'replace',
    'premailer',
    'htmlmin',
    'mailgun'
  ]);

  grunt.registerTask('build', [
    'assemble',
    'postcss',
    'imagemin',
    'replace',
    'premailer',
    'htmlmin'
  ]);

};
