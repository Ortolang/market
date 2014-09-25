'use strict';

describe('Controller: MetadataUploadCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));

    var MetadataUploadCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        MetadataUploadCtrl = $controller('MetadataUploadCtrl', {
            $scope: scope
        });
    }));

    it('should attach FileUploader to the scope', function () {
        expect(scope.metadataUploader).toBeDefined();
    });
});
