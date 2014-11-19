'use strict';

describe('Controller: MarketItemCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));
  beforeEach(module('ortolangMarketAppMock'));

  var MarketItemCtrl,
    scope,
    ObjectResource,
    DownloadResource, 
    N3Serializer,
    VisualizerManager,
    sample;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $compile, _ObjectResource_, _DownloadResource_, _N3Serializer_, _sample_, _VisualizerManager_) {
    scope = $rootScope.$new();
    sample = _sample_;
    ObjectResource = _ObjectResource_;
    DownloadResource = _DownloadResource_;
    N3Serializer = _N3Serializer_;

    MarketItemCtrl = $controller('MarketItemCtrl', {
      $rootScope: $rootScope,
      $scope: scope,
      $routeParams: {itemKey: sample().rootCollectionKey},
      $compile: $compile,
      ObjectResource: ObjectResource,
      DownloadResource: DownloadResource,
      N3Serializer: N3Serializer
    });
  }));

  it('should load objects', function() {
        expect(MarketItemCtrl).toBeDefined();
        expect(scope.itemKey).toBe(sample().rootCollectionKey);
        // expect(scope.oobject).toEqualData(sample().oobjectSample);
        // expect(scope.downloadUrl).toBe('url');
        // expect(scope.items[0].meta).toBe(sample().sampleN3);
        // expect(scope.items[0].oobject).toEqualData(sample().oobjectSample); // Why toBe not true ??
    });

});
