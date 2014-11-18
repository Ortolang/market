'use strict';

describe('Service: N3Serializer', function () {

  // load the service's module
  beforeEach(module('ortolangMarketApp'));

  // instantiate service
  var N3Serializer;
  beforeEach(inject(function (_N3Serializer_) {
    N3Serializer = _N3Serializer_;
  }));

  it('should have controller marketHomeCtrl be defined', function() {
        var content = '';
        // expect($location.path()).toBe('/about');
        // expect(scope.isActive('/about')).toBe(true);
        // expect(scope.isActive('/contact')).toBe(false);

        // expect(marketHomeCtrl.initScopeVariables()).toBeDefined();
    });
});
