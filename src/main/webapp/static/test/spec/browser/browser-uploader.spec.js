'use strict';

describe('Controller: BrowserUploaderCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    var BrowserUploaderCtrl,
        BrowserUploaderCtrlBis,
        scope,
        scopeBis,
        $rootScope,
        sample;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, _$rootScope_, _sample_) {
        $rootScope = _$rootScope_;
        sample = _sample_;
        scope = $rootScope.$new();
        scopeBis = $rootScope.$new();
        scope.$ctrl = {};
        scope.$ctrl.workspace = {
            name: 'system'
        };
        scope.parent = {path: '/'};
        scopeBis.$ctrl = {};
        scopeBis.$ctrl.workspace = {
            name: 'test'
        };
        scopeBis.parent = {path: '/test'};
        BrowserUploaderCtrlBis = $controller('BrowserUploaderCtrl', {
            $scope: scopeBis
        });
        BrowserUploaderCtrl = $controller('BrowserUploaderCtrl', {
            $scope: scope
        });
    }));

    it('should attach FileUploader to the scope', function () {
        expect($rootScope.uploader).toBeDefined();
    });

    // TODO rewrite
    // it('should filter folders', function () {
    //     $rootScope.uploader.addToQueue(sample().folderUploadMock);
    //     expect($rootScope.uploader.queue.length).toEqual(0);
    // });

    // it('should be possible to upload object and metadata', function () {
    //     $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'object'});
    //     $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'metadata'});
    //     scope.selectedChild = {name: 'toto'};
    //     $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'metadata'});
    //     expect($rootScope.uploader.queue.length).toEqual(3);
    // });
    //
    // it('should remove item from queue and log an error when no ortolang type provided', function () {
    //     spyOn(console, 'error');
    //     $rootScope.uploader.addToQueue(sample().fileUploadMock);
    //     expect(console.error).toHaveBeenCalledWith('No ortolang type provided');
    //     expect($rootScope.uploader.queue.length).toEqual(0);
    // });

    //it('should be possible to clear an item from queue', function () {
    //    $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'object'});
    //    expect($rootScope.uploader.queue.length).toEqual(1);
    //console.log($rootScope.uploader.getNotUploadedItems());
    //scope.clearItem([0]);
    //expect($rootScope.uploader.queue.length).toEqual(0);
    //});

    // it('should be possible to clear the entire queue', function () {
    //     $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'object'});
    //     $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'object'});
    //     $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'object'});
    //     expect($rootScope.uploader.queue.length).toEqual(3);
    //     scope.clearUploaderQueue();
    //     expect($rootScope.uploader.queue.length).toEqual(0);
    // });
});
