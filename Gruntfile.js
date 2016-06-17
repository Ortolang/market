// Generated on 2014-09-19 using generator-angular 0.9.8
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the application
    var appConfig = {
        base: require('./bower.json').basePath,
        app: require('./bower.json').basePath + '/app',
        test: require('./bower.json').basePath + '/test',
        tmp: '.tmp',
        components: 'bower_components',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= yeoman.app %>/**/*.js'],
                //tasks: ['newer:jshint:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            jsTest: {
                files: ['<%= yeoman.test %>/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma:continuous']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            less: {
                files: ['<%= yeoman.app %>/styles/less/{,*/}*.less'],
                tasks: ['less:development']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/**/*.html',
                    '<%= yeoman.tmp %>/styles/{,*/}*.css',
                    '<%= yeoman.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                protocol: 'http',
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    protocol: 'http',
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect.static(appConfig.tmp),
                            connect().use(
                                '/bower_components',
                                connect.static(appConfig.components)
                            ),
                            connect.static(appConfig.app),
                            connect().use(function (req, res, next) {
                                res.end(grunt.file.read(appConfig.app + '/index.html'));
                            })
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            connect.static(appConfig.tmp),
                            connect.static(appConfig.test),
                            connect().use(
                                '/bower_components',
                                connect.static(appConfig.components)
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                force: true
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/{,*/}*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            options: {
                force: true
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= yeoman.tmp %>',
                        '<%= yeoman.dist %>/{,*/}*'
                    ]
                }]
            },
            server: '<%= yeoman.tmp %>'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version', 'Safari >= 3', 'Explorer >= 10', 'iOS >= 6', 'Firefox >= 15']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.tmp %>/styles/',
                    src: '{,*/}*.css',
                    dest: '<%= yeoman.tmp %>/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                options: {
                    exclude: [
                        'bower_components/bootstrap/dist/css/bootstrap.css',
                        'bower_components/bootstrap-css-only/css/bootstrap.css'
                    ],
                    ignorePath:  /\.\.\//
                }
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= yeoman.dist %>/scripts/{,*/}*.js',
                    '<%= yeoman.dist %>/styles/{,*/}*.css',
                    //'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.dist %>/assets/fonts/*'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglify'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images']
            }
        },

        // The following *-min tasks will produce minified files in the dist folder
        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/styles/main.css': [
        //         '<%= yeoman.tmp %>/styles/{,*/}*.css'
        //       ]
        //     }
        //   }
        // },
        // uglify: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/scripts/scripts.js': [
        //         '<%= yeoman.dist %>/scripts/scripts.js'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/assets/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/assets/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/assets/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/assets/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: false,
                    minifyJS: true
                    //processScripts: ['text/ng-template']
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['**/*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt,xml}',
                        '**/*.html',
                        'assets/**/*',
                        'fonts/**/*',
                        'resources/**/*',
                        '**/*.json',
                        '!keycloak.json',
                        'vendor/player_flv_maxi.swf'
                    ]
                }, {
                    expand: true,
                    cwd: '<%= yeoman.tmp %>/images',
                    dest: '<%= yeoman.dist %>/assets/images',
                    src: ['generated/*']
                }, {
                    expand: true,
                    cwd: '<%= yeoman.components %>/bootstrap/dist',
                    src: 'fonts/*',
                    dest: '<%= yeoman.dist %>'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.components %>/font-awesome',
                    src: 'fonts/*',
                    dest: '<%= yeoman.dist %>'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.components %>/octicons/octicons',
                    src: [
                        '*',
                        '!*.{css,scss,md}'
                    ],
                    dest: '<%= yeoman.dist %>/fonts'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.components %>/zeroclipboard/dist',
                    src: [
                        '*.swf'
                    ],
                    dest: '<%= yeoman.dist %>/vendor'
                }]
            },
            devDist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '**/*.js',
                        'fonts/**/*',
                        'resources/**/*',
                        'vendor/player_flv_maxi.swf'
                    ]
                }, {
                    expand: true,
                    cwd: '.',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        'bower_components/**/*.js',
                        'bower_components/**/*.css',
                        'bower_components/**/*.map',
                        'bower_components/bootstrap/dist/fonts/*',
                        'bower_components/font-awesome/fonts/*',
                        'bower_components/octicons/octicons/*',
                        'bower_components/zeroclipboard/dist/*.swf',
                        'bower_components/angular-zeroclipboard/src/angular-zeroclipboard.js',
                        '!bower_components/*/{src,src/**,test,test/**}'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '<%= yeoman.tmp %>/styles/',
                src: [
                    '{,*/}*.css',
                    '{,*/}*.less'
                ]
            },
            swf: {
                expand: true,
                cwd: '<%= yeoman.components %>/zeroclipboard/dist',
                src: 'ZeroClipboard.swf',
                dest: '<%= yeoman.app %>/vendor/'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'copy:styles',
                'copy:swf'
            ],
            test: [
                'copy:styles',
                'copy:swf'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },

        // Test settings
        karma: {
            options: {
                configFile: '<%= yeoman.test %>/karma.conf.js'
            },
            continuous: {
                singleRun: true,
                browsers: ['PhantomJS']
            },
            dev: {
                browsers: ['Chrome', 'Firefox'],
                singleRun: false,
                reporters: 'dots'
            }
        },

        // LESS settings
        less: {
            development: {
                options: {
                    paths: ['.'],
                    compress: false,
                    sourceMap: true,
                    sourceMapFileInline: true,
                    outputSourceFiles: true,
                    modifyVars: {
                        'octicons-font-path': '"/<%= yeoman.components %>/octicons/octicons"'
                    }
                },
                files: {
                    '<%= yeoman.components %>/bootstrap/dist/css/custom-bootstrap.css': '<%= yeoman.app %>/styles/less/custom-bootstrap.less',
                    '<%= yeoman.app %>/styles/app.css': '<%= yeoman.app %>/styles/less/app.less',
                    '<%= yeoman.components %>/octicons/octicons/octicons.css': '<%= yeoman.components %>/octicons/octicons/octicons.less'
                }
            },
            production: {
                options: {
                    paths: ['.'],
                    compress: false,
                    sourceMap: false,
                    modifyVars: {
                        'icon-font-path': '"../fonts/"',
                        'octicons-font-path': '"../fonts"'
                    }
                },
                files: {
                    '<%= yeoman.components %>/bootstrap/dist/css/custom-bootstrap.css': '<%= yeoman.app %>/styles/less/custom-bootstrap.less',
                    '<%= yeoman.dist %>/styles/app.css': '<%= yeoman.app %>/styles/less/app.less',
                    '<%= yeoman.components %>/octicons/octicons/octicons.css': '<%= yeoman.components %>/octicons/octicons/octicons.less'
                }
            },
            'dev-production': {
                options: {
                    paths: ['.'],
                    compress: false,
                    sourceMap: false,
                    modifyVars: {
                        'icon-font-path': '"../fonts/"'
                    }
                },
                files: {
                    '<%= yeoman.components %>/bootstrap/dist/css/custom-bootstrap.css': '<%= yeoman.app %>/styles/less/custom-bootstrap.less',
                    '<%= yeoman.dist %>/styles/app.css': '<%= yeoman.app %>/styles/less/app.less',
                    '<%= yeoman.components %>/octicons/octicons/octicons.css': '<%= yeoman.components %>/octicons/octicons/octicons.less'
                }
            }
        },

        replace: {
            dist: {
                options: {
                    preserveOrder: true,
                    patterns: [
                        {
                            match: /\/vendor\/ZeroClipboard\.swf/,
                            replacement: '../vendor/ZeroClipboard.swf'
                        },
                        {
                            match: /<!--<script src="ortolang-config-url"><\/script>-->/,
                            replacement: '<script src="${api_url}/config/client"></script>'
                        },
                        {
                            match: 'version',
                            replacement: require('./package.json').version
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['scripts/scripts.js', 'index.html', 'market/home.html'],
                        dest: '<%= yeoman.dist %>/'
                    }
                ]
            }
        },

        htmlangular: {
            options: {
                tmplext: 'html',
                concurrentJobs: '3',
                customtags: [
                    'formly-form',
                    'item',
                    'multi-avatar',
                    'sparql-select',
                    'toggle-switch'
                ],
                customattrs: [
                    'translate',
                    'browser',
                    'hljs',
                    'source',
                    'holder-js',
                    'bs-tooltip',
                    'bs-active-pane',
                    'bs-pane',
                    'bs-tabs',
                    'toggle-visibility',
                    'editable-text',
                    'editable-textarea',
                    'editable-email',
                    'editable-url',
                    'editable-number',
                    'editable-select',
                    'editable-radiolist',
                    'e-ng-options',
                    'e-name',
                    'e-placeholder',
                    'e-value',
                    'e-pattern',
                    'buttons',
                    'nv-file-over',
                    'nv-file-drop',
                    'uploader',
                    'options',
                    'show-errors',
                    'sf-schema',
                    'sf-form',
                    'sf-model',
                    'sparql',
                    'placeholder',
                    'name',
                    'model',
                    'auto-complete',
                    'required',
                    'aria-expanded',
                    'profile-data-field',
                    'multi-avatar'
                ],
                relaxerror: [
                    'Bad value',
                    'Element img is missing required attribute src.',
                    'A table row was 7 columns wide and exceeded the column count established by the first row (6).'
                ],
                reportpath: 'target/html-angular-validate-report.json',
                w3clocal: 'http://localhost/w3c-validator/check'
            },
            files: {
                src: [
                    '<%= yeoman.app %>/*/*.html',
                    '<%= yeoman.app %>/404.html'
                ]
            }
        },

        validation: {
            options: {
                reset: grunt.option('reset') || false,
                stoponerror: false,
                relaxerror: [
                    'Attribute ng-controller not allowed on element body at this point',
                    'Attribute ng-include not allowed on element div at this point.',
                    'Element main not allowed'
                ],
                serverUrl: 'http://localhost/w3c-validator/check'
            },
            files: {
                src: [
                    '<%= yeoman.app %>/index.html',
                    '<%= yeoman.app %>/ie.html'
                ]
            }
        },

        ngtemplates: {
            dist: {
                cwd: '<%= yeoman.app %>',
                src: ['*/**/*.html'],
                dest: '<%= yeoman.tmp %>/templates.js',
                options:  {
                    module: 'ortolangMarketApp',
                    usemin: '<%= yeoman.dist %>/scripts/scripts.js', // <~~ This came from the <!-- build:js --> block
                    htmlmin:  '<%= htmlmin.dist.options %>',
                    quotes: 'single'
                }
            },
            test: {
                cwd: '<%= yeoman.app %>',
                src: ['*/**/*.html'],
                dest: '<%= yeoman.tmp %>/templates.js',
                options:  {
                    module: 'ortolangMarketApp',
                    quotes: 'single'
                }
            }
        }
    });

    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'less:development',
            'wiredep',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'less:development',
        'concurrent:test',
        'autoprefixer',
        'ngtemplates:test',
        'connect:test',
        'karma:continuous'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'less:production',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'ngtemplates:dist',
        'concat',
        'copy:dist',
        'cssmin',
        'uglify',
        'replace:dist',
        'filerev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('dev-build', [
        'clean:dist',
        'less:dev-production',
        'wiredep',
        'concurrent:dist',
        'copy:dist',
        'copy:devDist'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);

};
