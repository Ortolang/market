'use strict';

describe('Filter: breakLineFilter', function () {

  // load the filter's module
  beforeEach(module('ortolangMarketApp'));

  // initialize a new instance of the filter before each test
  var breakLineFilter;
  beforeEach(inject(function ($filter) {
    breakLineFilter = $filter('breakLineFilter');
  }));

  it('should return the input prefixed with "breakLineFilter filter:"', function () {
    var text = 'angularjs';
    expect(breakLineFilter(text)).toBe('breakLineFilter filter: ' + text);
  });

});
