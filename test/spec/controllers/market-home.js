'use strict';

describe('Controller: MarketHomeCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));

  var MarketHomeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MarketHomeCtrl = $controller('MarketHomeCtrl', {
      $scope: scope
    });
  }));

});
