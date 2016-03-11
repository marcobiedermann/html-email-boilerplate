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

    mailgun: {
      newsLetter: {
        options: {
          key: 'key-8edcd91e9c74b24b14be44c28bc34dbe',
          sender: 'marco.biedermann@gmx.de',
          recipient: [
            'marco.biedermann@gmx.de'
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
      sass: {
        files: ['source/assets/scss/**/*.scss'],
        tasks: ['sass']
      },
    }

  });

  grunt.registerTask('default', [
    'assemble',
    'sass',
    'watch'
  ]);

  grunt.registerTask('send', [
    'assemble',
    'sass',
    'premailer',
    'htmlmin',
    'mailgun'
  ]);

  grunt.registerTask('build', [
    'assemble',
    'sass',
    'premailer',
    'htmlmin',
    'watch'
  ]);

};
