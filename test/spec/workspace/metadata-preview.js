'use strict';

describe('Controller: MetadataPreviewCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));

    var MetadataPreviewCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        MetadataPreviewCtrl = $controller('MetadataPreviewCtrl', {
            $scope: scope
        });
    }));

});
