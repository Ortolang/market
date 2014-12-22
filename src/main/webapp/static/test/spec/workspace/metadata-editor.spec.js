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

  it('should have setted editorVisibility to true when show editor panel', function() {
        scope.showEditor();
        expect(scope.editorVisibility).toBe(true);
  });
});
