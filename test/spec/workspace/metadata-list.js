'use strict';

describe('Controller: MetadataListCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));

  var MetadataListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MetadataListCtrl = $controller('MetadataListCtrl', {
      $scope: scope
    });
  }));

});
