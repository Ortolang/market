'use strict';

describe('Controller: BrowserSidebarMetadataCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));

  var BrowsersidebarmetadataCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BrowserSidebarMetadataCtrl = $controller('BrowserSidebarMetadataCtrl', {
      $scope: scope
    });
  }));

});
