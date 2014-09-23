'use strict';

describe('Controller: UploadCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));

    var UploadCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        UploadCtrl = $controller('UploadCtrl', {
            $scope: scope
        });
    }));

    it('should attach FileUploader to the scope', function () {
        expect(scope.uploader).toBeDefined();
    });
});
