'use strict';

describe('Controller: MetadataPreviewCtrl', function () {

    var MetadataPreviewCtrl,
        DownloadResource,
        scope,
        rootScope;

    // load the controller's module
    beforeEach(function() {

        var mockDownloadResource = {};
          module('ortolangMarketApp', function($provide) {
            $provide.value('DownloadResource', mockDownloadResource);
          });

        inject(function($q) {
            mockDownloadResource.data = 'sample code';

            mockDownloadResource.download = function(params) {
              var defer = $q.defer(), data = this.data, successMethod = params.oKey == 'k1';
              defer.resolve(data);


              var promise = defer.promise;
              promise.success = function(fct) {
                if(successMethod) {
                    fct(data);
                }
                return this;
              };
              promise.error = function(fct) {
                if(!successMethod) {
                    fct();
                }
                return this;
              };

              return promise;
            };

        });
    });

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _DownloadResource_) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        DownloadResource = _DownloadResource_;

        MetadataPreviewCtrl = $controller('MetadataPreviewCtrl', {
            $scope: scope,
            DownloadResource: DownloadResource
        });
        scope.$digest();
    }));

  it('should have setted code and selectedMetadata variable', function() {
        
        var metadata = {key: 'k1'};
        rootScope.$broadcast('metadata-preview', metadata);
        // scope.previewMetadata(metadata).then(function() {

        //     expect(scope.code).toBe('sample code');
        //     expect(scope.selectedMetadata).toBe(metadata);
        // });
    });

  it('should not have setted code and selectedMetadata variable', function() {
        var metadata = {key: 'k2'};
        rootScope.$broadcast('metadata-preview', metadata);
    });
});
