'use strict';

describe('Controller: BagUploaderCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));

  var BagUploaderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BagUploaderCtrl = $controller('BagUploaderCtrl', {
      $scope: scope
    });
  }));

});
