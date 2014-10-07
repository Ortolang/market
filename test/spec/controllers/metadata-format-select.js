'use strict';

describe('Controller: MetadataFormatSelectCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));

  var MetadataFormatSelectCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MetadataFormatSelectCtrl = $controller('MetadataFormatSelectCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
