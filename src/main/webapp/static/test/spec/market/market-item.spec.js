'use strict';

describe('Controller: MarketItemCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));
  beforeEach(module('ortolangMarketAppMock'));

  var controllerCreator,
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
    VisualizerManager = _VisualizerManager_;

    controllerCreator = function(params) {
      return $controller('MarketItemCtrl', {
        $rootScope: $rootScope,
        $scope: scope,
        $routeParams: params,
        $compile: $compile,
        ObjectResource: ObjectResource,
        DownloadResource: DownloadResource,
        N3Serializer: N3Serializer
      });
    };

  }));

  it('should load an object', function() {
    ObjectResource.when({oKey: sample().rootCollectionKey}, sample().oobjectSample);
    ObjectResource.when({oKey: sample().rootCollectionKey, path: sample().rootCollectionKey}, sample().oobjectSample);

    var MarketItemCtrl = controllerCreator({itemKey: sample().rootCollectionKey});
    scope.$digest();

    expect(MarketItemCtrl).toBeDefined();
    expect(scope.itemKey).toBe(sample().rootCollectionKey);
    expect(scope.oobject).toEqualData(sample().oobjectSample);
    expect(scope.downloadUrl).toBe('url');
    expect(scope.item).toEqualData(sample().sampleN3);
    expect(scope.previewCollection).toEqualData(sample().oobjectSample);
  });

  it('should load an object with metadata not found', function() {
    ObjectResource.when({oKey: sample().rootCollectionWithOtherMetaKey}, sample().oobjectWithOtherMetaSample);

    var MarketItemCtrl = controllerCreator({itemKey: sample().rootCollectionWithOtherMetaKey});

    spyOn(console, 'error');

    scope.$digest();

    expect(MarketItemCtrl).toBeDefined();
    expect(scope.itemKey).toBe(sample().rootCollectionWithOtherMetaKey);
    expect(console.error).toHaveBeenCalled();

  });

  it('should not load an object', function() {
    var MarketItemCtrl = controllerCreator({itemKey: sample().unknowObjectKey});

    spyOn(console, 'error');

    scope.$digest();

    expect(MarketItemCtrl).toBeDefined();
    expect(scope.itemKey).toBe(sample().unknowObjectKey);
    expect(console.error).toHaveBeenCalled();

  });

  it('should load browse view', function() {
    ObjectResource.when({oKey: sample().rootCollectionKey}, sample().oobjectSample);

    var MarketItemCtrl = controllerCreator({itemKey: sample().rootCollectionKey, view: 'browse'});
    scope.$digest();

    expect(MarketItemCtrl).toBeDefined();
    expect(scope.itemKey).toBe(sample().rootCollectionKey);
    expect(scope.oobject).toEqualData(sample().oobjectSample);
    expect(scope.downloadUrl).toBe('url');
    expect(scope.marketItemTemplate).toBe('market/market-item-collection.html');

  });

  it('should not load a view', function() {
    ObjectResource.when({oKey: sample().metadataObjectKey}, sample().metadataOobjectSample);

    var MarketItemCtrl = controllerCreator({itemKey: sample().metadataObjectKey});
    scope.$digest();

    expect(MarketItemCtrl).toBeDefined();
    expect(scope.itemKey).toBe(sample().metadataObjectKey);
    expect(scope.oobject).toEqualData(sample().metadataOobjectSample);
    expect(scope.downloadUrl).toBe('url');
    expect(scope.marketItemTemplate).toBeUndefined();

  });

});
