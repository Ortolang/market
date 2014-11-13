'use strict';

describe('Controller: MetadataEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));

  var MetadataEditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MetadataEditorCtrl = $controller('MetadataEditorCtrl', {
      $scope: scope
    });
  }));

});
