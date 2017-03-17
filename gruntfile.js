module.exports = function(grunt) {

  'use strict';

  require('jit-grunt')(grunt, {
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    ejs: {
      files: {
        expand: true,
        cwd: 'source/templates/mails',
        dest: 'build',
        src: '**/*.ejs',
        ext: '.html'
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
        tasks: ['ejs']
      },
      images: {
        files: ['source/content/images/**/*.{gif,jpg,jpeg,png}'],
        tasks: ['imagemin']
      }
    }

  });

  grunt.registerTask('default', [
    'ejs',
    'postcss',
    'imagemin',
    'watch'
  ]);

  grunt.registerTask('send', [
    'ejs',
    'postcss',
    'imagemin',
    'replace',
    'premailer',
    'htmlmin',
    'mailgun'
  ]);

  grunt.registerTask('build', [
    'ejs',
    'postcss',
    'imagemin',
    'replace',
    'premailer',
    'htmlmin'
  ]);

};
