'use strict';

describe('Controller: MarketItemCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));

  var MarketItemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MarketItemCtrl = $controller('MarketItemCtrl', {
      $scope: scope
    });
  }));

});
