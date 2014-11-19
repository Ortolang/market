'use strict';

describe('Controller: BrowserSidebarMetadataCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));

    var BrowserSidebarMetadataCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        BrowserSidebarMetadataCtrl = $controller('BrowserSidebarMetadataCtrl', {
            $scope: scope
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
        scope.showMetadataEditor('market-ortolang-n3');

        scope.$on('metadata-editor-show', function(event, metadataFormat) {
            console.debug(metadataFormat);
        });

    });
});
