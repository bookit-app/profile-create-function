module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-simple-nyc');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      options: {
        configFile: '.eslintrc.yml',
      },
      target: ['./src/**/*.js']
    },
    mochaTest: {
      unit: {
        options: {
          reporter: 'spec'
        },
        src: 'tests/**/*.spec.js'
      }
    },
    nyc: {
      cover: {
        options: {
          all: false,
          'check-coverage': true,
          include: ['src/**/*.js'],
          exclude: [],
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
          reporter: ['html', 'text', 'text-summary'],
          instrument: true
        },
        cmd: false,
        args: ['grunt', 'mochaTest:unit']
      },
      report: {
        options: {
          reporter: 'text-summary'
        }
      }
    }
  });

  grunt.registerTask('default', ['eslint', 'nyc:cover']);
};
