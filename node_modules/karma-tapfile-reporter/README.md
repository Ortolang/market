karma-tap-reporter
==================

Based heavily on karma-junit-reporter, but outputs TAP (test anything protocol)

Configure in karma.config.js as:

```
        reporters: ['mocha', 'tapFile'],

        tapFileReporter: {
            outputFile: 'test/unit/report.tap',
            suite: ''
        }
```