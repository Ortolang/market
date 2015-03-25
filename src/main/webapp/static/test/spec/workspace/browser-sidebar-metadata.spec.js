'use strict';

describe('Controller: BrowserSidebarMetadataCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    var BrowserSidebarMetadataCtrl,
        scope,
        rootScope,
        sample,
        WorkspaceElementResource,
        MetadataFormatResource;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _WorkspaceElementResource_, _MetadataFormatResource_, _sample_) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        sample = _sample_;
        WorkspaceElementResource = _WorkspaceElementResource_;
        MetadataFormatResource = _MetadataFormatResource_;

        scope.refreshSelectedElement = function () {
            return 'michel';
        };

        spyOn(scope, 'refreshSelectedElement').and.callFake(function () {return 'michel'; });
        spyOn(rootScope, '$broadcast').and.callThrough();

        BrowserSidebarMetadataCtrl = $controller('BrowserSidebarMetadataCtrl', {
            $scope: scope,
            $rootScope: rootScope,
            WorkspaceElementResource: WorkspaceElementResource,
            MetadataFormatResource: MetadataFormatResource
        });
    }));

    it('should show MetadataEditorList', function () {
        scope.showMetadataEditorList();

        expect(scope.metadataEditorListVisibility).toBe(true);
    });

    it('should hide MetadataEditorList', function () {
        scope.hideMetadataEditorList();

        expect(scope.metadataEditorListVisibility).toBe(false);
    });

    it('should toggle MetadataEditorList', function () {
        expect(scope.metadataEditorListVisibility).toBe(false);

        scope.toggleMetadataEditorList();
        expect(scope.metadataEditorListVisibility).toBe(true);

        scope.toggleMetadataEditorList();
        expect(scope.metadataEditorListVisibility).toBe(false);
    });

    it('should check if MetadataEditorList is show', function () {
        expect(scope.isMetadataEditorListShow()).toBe(false);

        scope.showMetadataEditorList();
        expect(scope.isMetadataEditorListShow()).toBe(true);
    });

    // it('should send metadata-editor-show event with correct metadata format', function () {
    //     var md = {name:'ortolang-item-json', description:'desc'};
    //     MetadataFormatResource.setDefaultValue({entries:[md]});

    //     scope.$digest();
    //     scope.showMetadataEditor('ortolang-item-json');

    //     expect(rootScope.$broadcast).toHaveBeenCalledWith('metadata-editor-show', md);

    // });

    it('should send metadata-preview event with correct metadata', function () {
        scope.previewMetadata('oai_dc');

        expect(rootScope.$broadcast).toHaveBeenCalledWith('metadata-preview', 'oai_dc');
    });

});
