'use strict';

describe('Controller: MetadataPreviewCtrl', function () {

    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    var MetadataPreviewCtrl,
        DownloadResource,
        scope,
        sample,
        rootScope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _DownloadResource_, _sample_) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        sample = _sample_;
        DownloadResource = _DownloadResource_;

        MetadataPreviewCtrl = $controller('MetadataPreviewCtrl', {
            $scope: scope,
            DownloadResource: DownloadResource
        });
        scope.$digest();
    }));

    it('should have set code and selectedMetadata variable', function () {

        var metadata = {key: sample().metadataObjectKey};
        rootScope.$broadcast('metadata-preview', metadata);
        expect(scope.code).toBe(sample().sampleCode);
        expect(scope.selectedMetadata).toBe(metadata);
    });

    it('should not have set code and selectedMetadata variable', function() {
        var metadata = {key: 'k2'};
        rootScope.$broadcast('metadata-preview', metadata);

        expect(scope.code).toBe(undefined);
        expect(scope.selectedMetadata).toBe(metadata);
    });
});
