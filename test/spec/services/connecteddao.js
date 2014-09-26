'use strict';

describe('Service: ConnectedDAO', function () {

  // load the service's module
  beforeEach(module('ortolangMarketApp'));

  // instantiate service
  var ConnectedDAO;
  beforeEach(inject(function (_ConnectedDAO_) {
    ConnectedDAO = _ConnectedDAO_;
  }));

  it('should do something', function () {
    expect(!!ConnectedDAO).toBe(true);
  });

});
