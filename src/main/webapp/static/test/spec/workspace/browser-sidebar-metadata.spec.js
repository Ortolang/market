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
        md = {
            id: 'oai_dc',
                name: 'OAI Dublin Core',
                description: 'Les métadonnées OAI Dublin core permettent d\'être accessible via la protocole OAI-PMH.',
                view: 'workspace/metadata-form-oai_dc.html',
                displayed: true
        };

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _WorkspaceElementResource_, _sample_) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        sample = _sample_;
        WorkspaceElementResource = _WorkspaceElementResource_;

        scope.refreshSelectedElement = function() {
            return 'michel';
        };

        spyOn(scope, 'refreshSelectedElement').andCallFake(function() {return 'michel';});
        spyOn(rootScope, '$broadcast').andCallThrough();

        BrowserSidebarMetadataCtrl = $controller('BrowserSidebarMetadataCtrl', {
            $scope: scope,
            $rootScope: rootScope,
            WorkspaceElementResource: WorkspaceElementResource
        });
    }));

    it('should show MetadataEditorList', function() {
        scope.showMetadataEditorList();

        expect(scope.metadataEditorListVisibility).toBe(true);
    });

    it('should hide MetadataEditorList', function() {
        scope.hideMetadataEditorList();

        expect(scope.metadataEditorListVisibility).toBe(false);
    });

    it('should toggle MetadataEditorList', function() {
        expect(scope.metadataEditorListVisibility).toBe(false);

        scope.toggleMetadataEditorList();
        expect(scope.metadataEditorListVisibility).toBe(true);

        scope.toggleMetadataEditorList();
        expect(scope.metadataEditorListVisibility).toBe(false);
    });

    it('should check if MetadataEditorList is show', function() {
        expect(scope.isMetadataEditorListShow()).toBe(false);

        scope.showMetadataEditorList();
        expect(scope.isMetadataEditorListShow()).toBe(true);
    });

    it('should send metadata-editor-show event with correct metadata format', function() {
        scope.showMetadataEditor('oai_dc');

        expect(rootScope.$broadcast).toHaveBeenCalledWith('metadata-editor-show', md);

    });

    it('should send metadata-editor-edit event with correct metadata', function() {

        scope.selectedElements = [{workspace:'sys',path:'path'}];

        scope.editMetadata(md);
        scope.$digest();

        // expect(rootScope.$broadcast).toHaveBeenCalledWith('metadata-editor-edit', md, sample().workspaceElement);

        spyOn(console, 'error');

        scope.editMetadata({name: 'metadata-not-known'});
        scope.$digest();

        expect(console.error).toHaveBeenCalled();
    });

    it('should send metadata-preview event with correct metadata', function() {
        scope.previewMetadata('oai_dc');

        expect(rootScope.$broadcast).toHaveBeenCalledWith('metadata-preview', 'oai_dc');
    });

    // it('should call delete method on workspace element', function() {

    //     scope.selectedElements = [{workspace:'sys',path:'path'}];

    //     scope.deleteMetadata(md);
    //     scope.$digest();

    //     expect(scope.selectedMetadata).toBeUndefined();
    //     expect(scope.refreshSelectedElement).toHaveBeenCalled();

    //     spyOn(console, 'error');

    //     scope.deleteMetadata({name: 'metadata-not-known'});
    //     scope.$digest();

    //     expect(console.error).toHaveBeenCalled();

    // });
});
