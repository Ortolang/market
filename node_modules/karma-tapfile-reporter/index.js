/**
 * Borrows heavily from karma-junit-reporter to output TAP
 * @type {exports}
 */


var os = require('os');
var path = require('path');
var fs = require('fs');

var TapFileReporter = function(baseReporterDecorator, config, logger, helper, formatError) {
    var log = logger.create('reporter.tap');
    var reporterConfig = config.tapFileReporter || Object.create(null);
    var pkgName = reporterConfig.suite || '';
    var outputFile = helper.normalizeWinPath(path.resolve(config.basePath, reporterConfig.outputFile
        || 'report.tap'));

    var tap = "";
    var suites = Object.create(null);
    var pendingFileWritings = 0;
    var fileWritingFinished = function() {};
    var allMessages = [];

    baseReporterDecorator(this);

    this.adapters = [function(msg) {
        console.log("allMessages " + msg);
        allMessages.push(msg);
    }];

    var initliazeSuitesForBrowser = function(browser) {
        var timestamp = (new Date()).toISOString().substr(0, 19);
        console.log("timestamp " + timestamp);
        suites[browser.id] = {
            name: browser.name,
            'package': pkgName,
            timestamp: timestamp,
            id: 0,
            hostname: os.hostname(),
            specs: []
        };
    };

    this.onBrowserStart = function(browser) {
        console.log("onBrowserStart " + browser);
        this._browsers.push(browser);
        initliazeSuitesForBrowser(browser);
    };

    this.onBrowserComplete = function(browser) {
        var suite = suites[browser.id];

        if (!suite) {
            // This browser did not signal `onBrowserStart`. That happens
            // if the browser timed out during the start phase.
            return;
        }

        var result = browser.lastResult;
        suite.numTests = result.total;
        suite.errors = result.disconnected || result.error ? true : false;
        suite.failures = result.failed;
        suite.time = (result.netTime || 0) / 1000;
        suite.systemOut = allMessages.join() + '\n';
    };

    this.onRunComplete = function() {
        var key, suite, spec, testNum = 0, failCount = 0;

        for (key in suites) {
            suite = suites[key];
            tap += "1.." + suite.numTests + "\n";
            for (var i = 0; i < suite.specs.length; i++) {
                spec = suite.specs[i];
                if (spec.passed) {
                    tap += "ok " + (i + 1) + " " + spec.description + "\n";
                }
                else {
                    failCount++;
                    tap += "not ok " + (i + 1) + " " + spec.description + "\n";
                    spec.failures.forEach(function(failure) {
                        if (failure) {
                            tap += failure.replace(/^/gm, '#  ') + "\n";
                        }

                    });
                }
            }
            tap += "# tests " + suite.numTests + "\n";
            tap += "# pass " + (suite.numTests - failCount) + "\n";
            tap += "# fail " + failCount + "\n";
        }

        var tapToOutput = tap;

        pendingFileWritings++;
        helper.mkdirIfNotExists(path.dirname(outputFile), function() {
            fs.writeFile(outputFile, tapToOutput, function(err) {
                if (err) {
                    log.warn('Cannot write tap\n\t' + err.message);
                } else {
                    log.debug('TAP results written to "%s".', outputFile);
                }

                if (!--pendingFileWritings) {
                    fileWritingFinished();
                }
            });
        });

        suites = tap = null;
        allMessages.length = 0;
    };

    this.specSuccess = this.specSkipped = this.specFailure = function(browser, result) {
        console.log("result.description " + result.description);
        var spec = {
            description: result.description,
            time: ((result.time || 0) / 1000),
            classname: (pkgName ? pkgName + ' ' : '') + browser.name + '.' + result.suite.join(' ').replace(/\./g, '_'),
            failures: []
        };


        if (result.skipped) {
            spec.skipped = true;
        }

        if (!result.success) {
            spec.passed = false;
            result.log.forEach(function(err) {
                spec.failures.push(formatError(err));
            });
        }
        else {
            spec.passed = true;
        }

        suites[browser.id].specs.push(spec);
    };

    // wait for writing all the tap files, before exiting
    this.onExit = function(done) {
        if (pendingFileWritings) {
            fileWritingFinished = done;
        } else {
            done();
        }
    };
};

TapFileReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError'];

// PUBLISH DI MODULE
module.exports = {
    'reporter:tapFile': ['type', TapFileReporter]
};