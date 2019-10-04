module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-simple-nyc');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-tslint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      unit: {
        options: {
          reporter: 'spec',
          require: 'ts-node/register'
        },
        src: 'tests/**/*.spec.ts'
      }
    },
    nyc: {
      cover: {
        options: {
          all: false,
          extension: ['.ts'],
          'check-coverage': true,
          include: ['src/**/*.ts'],
          exclude: [],
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
          reporter: ['html', 'text', 'text-summary'],
          require: ['ts-node/register'],
          sourceMap: true,
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
    },
    tslint: {
      options: {
        configuration: './tslint.json',
        project: './tsconfig.json'
      },
      files: {
        src: ['src/**/*.ts']
      }
    },
    run: {
      transpile: {
        cmd: 'npm',
        args: ['run', 'tsc']
      }
    }
  });

  grunt.registerTask('build', ['tslint', 'nyc:cover', 'run:transpile']);
  grunt.registerTask('default', ['tslint', 'run:transpile']);
};
