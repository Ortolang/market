'use strict';

describe('Controller: MetadataFormMarketOrtolangCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));

  var MetadataFormMarketOrtolangCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MetadataFormMarketOrtolangCtrl = $controller('MetadataFormMarketOrtolangCtrl', {
      $scope: scope
    });
  }));

});
