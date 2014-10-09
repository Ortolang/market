'use strict';

describe('Controller: MetadataCreatorCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));

  var MetadataCreatorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MetadataCreatorCtrl = $controller('MetadataCreatorCtrl', {
      $scope: scope
    });
  }));

});
