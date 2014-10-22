'use strict';

describe('Controller: BrowserCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));

    var BrowserCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        BrowserCtrl = $controller('BrowserCtrl', {
            $scope: scope
        });
    }));

});
