'use strict';

describe('Controller: MarketItemCtrl', function () {

    // load the controller's module
    beforeEach(angular.mock.module('ortolangMarketApp'));
    beforeEach(angular.mock.module('ortolangMarketAppMock'));

    var controllerCreator,
        scope,
        SearchResource,
        VisualizerService,
        sample;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $compile, _SearchResource_, _sample_, _VisualizerService_) {
        scope = $rootScope.$new();
        sample = _sample_;
        SearchResource = _SearchResource_;
        VisualizerService = _VisualizerService_;

        controllerCreator = function (params) {
            return $controller('MarketItemCtrl', {
                $rootScope: $rootScope,
                $scope: scope,
                $routeParams: params,
                $compile: $compile,
                SearchResource: SearchResource
            });
        };

    }));

    // it('should load an object', function() {
    //   var key = sample().rootCollectionKey;
    //   var queryItem = 'select * from OrtolangObject where ortolang_status = \'published\' and ortolang_key = \''+key+'\' ';
    //   SearchResource.when({query: queryItem}, sample().queryItem);
    //   var queryOrtolangMeta = 'select from '+sample().ridItem;
    //   SearchResource.when({query: queryOrtolangMeta}, sample().query1Results);

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
    //    SearchResource.when({query: queryItem}, sample().queryItem);
    //    var queryOrtolangMeta = 'select from '+sample().ridItem;
    //    SearchResource.when({query: queryOrtolangMeta}, sample().query1Results);
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
