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

    sass: {
      files: {
        expand: true,
        cwd: 'source/assets/scss',
        dest: 'build/assets/css',
        src: '**/*.scss',
        ext: '.css'
      }
    },

    watch: {
      html: {
        files: ['source/templates/**/*.html'],
        tasks: ['assemble']
      },
      images: {
        files: ['source/content/images/**/*.{gif,jpg,jpeg,png}'],
        tasks: ['imagemin']
      },
      sass: {
        files: ['source/assets/scss/**/*.scss'],
        tasks: ['sass']
      },
    }

  });

  grunt.registerTask('default', [
    'assemble',
    'sass',
    'imagemin',
    'watch'
  ]);

  grunt.registerTask('send', [
    'assemble',
    'sass',
    'imagemin',
    'replace',
    'premailer',
    'htmlmin',
    'mailgun'
  ]);

  grunt.registerTask('build', [
    'assemble',
    'sass',
    'imagemin',
    'replace',
    'premailer',
    'htmlmin'
  ]);

};
