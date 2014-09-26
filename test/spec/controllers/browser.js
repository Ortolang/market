'use strict';

describe('Controller: BrowserCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));

    var WorkspaceElementsCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        WorkspaceElementsCtrl = $controller('WorkspaceElementsCtrl', {
            $scope: scope
        });
    }));

});
