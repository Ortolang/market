'use strict';

var logoutRedirectUrl;

beforeEach(function () {
    logoutRedirectUrl = 'http://localhost:9000/';
    jasmine.addMatchers({
        toEqualData: function () {
            return {
                compare: function (actual, expected) {
                    var passed = angular.equals(actual, expected);
                    return {
                        pass: passed,
                        message: 'Expected ' + actual + (passed ? '' : ' not') + ' to equalData ' + expected
                    };
                }
            };
        }
    });
});
