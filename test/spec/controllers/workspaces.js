'use strict';

describe('Controller: WorkspacesCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));

  var WorkspacesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WorkspacesCtrl = $controller('WorkspacesCtrl', {
      $scope: scope
    });
  }));

});
