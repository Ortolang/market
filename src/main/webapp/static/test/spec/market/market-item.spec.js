'use strict';

describe('Controller: MarketItemCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    var controllerCreator,
        scope,
        ObjectResource,
        JsonResultResource,
        VisualizerManager,
        sample;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $compile, _ObjectResource_, _JsonResultResource_, _sample_, _VisualizerManager_) {
        scope = $rootScope.$new();
        sample = _sample_;
        ObjectResource = _ObjectResource_;
        JsonResultResource = _JsonResultResource_;
        VisualizerManager = _VisualizerManager_;

        controllerCreator = function(params) {
            return $controller('MarketItemCtrl', {
                $rootScope: $rootScope,
                $scope: scope,
                $routeParams: params,
                $compile: $compile,
                ObjectResource: ObjectResource,
                JsonResultResource: JsonResultResource
            });
        };

    }));

    // it('should load an object', function() {
    //   var key = sample().rootCollectionKey;
    //   var queryItem = 'select * from OrtolangObject where ortolang_status = \'published\' and ortolang_key = \''+key+'\' ';
    //   JsonResultResource.when({query: queryItem}, sample().queryItem);
    //   var queryOrtolangMeta = 'select from '+sample().ridItem;
    //   JsonResultResource.when({query: queryOrtolangMeta}, sample().query1Results);

    //   var MarketItemCtrl = controllerCreator({itemKey: key});
    //   scope.$digest();

    //   expect(MarketItemCtrl).toBeDefined();
    //   expect(scope.itemKey).toBe(sample().rootCollectionKey);
    //   expect(scope.downloadUrl).toBe('url');
    //   expect(scope.ortolangObject).toEqualData(angular.fromJson(sample().queryItem[0]));
    //   expect(scope.item).toEqualData(angular.fromJson(sample().query1Results[0]));
    // });

    //it('should load an object with metadata not found', function() {
    //    ObjectResource.when({oKey: sample().rootCollectionWithOtherMetaKey}, sample().oobjectWithOtherMetaSample);
    //
    //    var MarketItemCtrl = controllerCreator({itemKey: sample().rootCollectionWithOtherMetaKey});
    //
    //    spyOn(console, 'error');
    //
    //    scope.$digest();
    //
    //    expect(MarketItemCtrl).toBeDefined();
    //    expect(scope.itemKey).toBe(sample().rootCollectionWithOtherMetaKey);
    //    expect(console.error).toHaveBeenCalled();
    //
    //});
    //
    //it('should not load an object', function() {
    //    var MarketItemCtrl = controllerCreator({itemKey: sample().unknowObjectKey});
    //
    //    spyOn(console, 'error');
    //
    //    scope.$digest();
    //
    //    expect(MarketItemCtrl).toBeDefined();
    //    expect(scope.itemKey).toBe(sample().unknowObjectKey);
    //    expect(console.error).toHaveBeenCalled();
    //
    //});
    //
    //it('should load browse view', function() {
    //    var key = sample().rootCollectionKey;
    //    var queryItem = 'select * from OrtolangObject where ortolang_status = \'published\' and ortolang_key = \''+key+'\' ';
    //    JsonResultResource.when({query: queryItem}, sample().queryItem);
    //    var queryOrtolangMeta = 'select from '+sample().ridItem;
    //    JsonResultResource.when({query: queryOrtolangMeta}, sample().query1Results);
    //
    //    var MarketItemCtrl = controllerCreator({itemKey: sample().rootCollectionKey, view: 'browse'});
    //    scope.$digest();
    //
    //    expect(MarketItemCtrl).toBeDefined();
    //    expect(scope.itemKey).toBe(sample().rootCollectionKey);
    //    expect(scope.marketItemTemplate).toBe('market/market-item-collection.html');
    //
    //});
    //
    //it('should not load a view', function() {
    //    var key = 'nokey';
    //    var MarketItemCtrl = controllerCreator({itemKey: key});
    //    scope.$digest();
    //
    //    expect(MarketItemCtrl).toBeDefined();
    //    expect(scope.itemKey).toBe(key);
    //    expect(scope.marketItemTemplate).toBeUndefined();
    //
    //});

});
