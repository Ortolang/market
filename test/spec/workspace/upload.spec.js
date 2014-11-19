'use strict';

describe('Controller: UploadCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    var UploadCtrl,
        UploadCtrlBis,
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
        scope.wsName = 'system';
        scope.parent = {path: '/'};
        scopeBis.wsName = 'test';
        scopeBis.parent = {path: '/test'};
        UploadCtrlBis = $controller('UploadCtrl', {
            $scope: scopeBis
        });
        UploadCtrl = $controller('UploadCtrl', {
            $scope: scope
        });
    }));

    it('should attach FileUploader to the scope', function () {
        expect(scope.uploader).toBeDefined();
    });

    it('should be able to toggle upload queue status', function () {
        var i, previousStatus;
        for (i = 0; i < 2; i++) {
            previousStatus = $rootScope.uploadQueueStatus;
            $rootScope.toggleUploadQueueStatus();
            if (previousStatus === 'active') {
                expect($rootScope.uploadQueueStatus).toBeUndefined();
            } else {
                expect($rootScope.uploadQueueStatus).toEqual('active');
            }
        }
    });

    it('should filter folders', function () {
        $rootScope.uploader.addToQueue(sample().folderUploadMock);
        expect($rootScope.uploader.queue.length).toEqual(0);
    });

    it('should be possible to upload object and metadata', function () {
        $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'object'});
        $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'metadata'});
        scope.selectedChild = {name: 'toto'};
        $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'metadata'});
        expect($rootScope.uploader.queue.length).toEqual(3);
    });

    it('should remove item from queue and log an error when no ortolang type provided', function () {
        spyOn(console, 'error');
        $rootScope.uploader.addToQueue(sample().fileUploadMock);
        expect(console.error).toHaveBeenCalledWith('No ortolang type provided');
        expect($rootScope.uploader.queue.length).toEqual(0);
    });

    it('should be possible to clear an item from queue', function () {
        $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'object'});
        expect($rootScope.uploader.queue.length).toEqual(1);
        scope.resizeBrowser = function () { };
        scope.clearItem($rootScope.uploader.getNotUploadedItems()[0]);
        expect($rootScope.uploader.queue.length).toEqual(0);
    });

    it('should be possible to clear the entire queue', function () {
        $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'object'});
        $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'object'});
        $rootScope.uploader.addToQueue(sample().fileUploadMock, {ortolangType: 'object'});
        expect($rootScope.uploader.queue.length).toEqual(3);
        scope.clearUploaderQueue();
        expect($rootScope.uploader.queue.length).toEqual(0);
    });
});
