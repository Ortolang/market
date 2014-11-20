'use strict';

describe('Controller: MarketHomeCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));
  beforeEach(module('ortolangMarketAppMock'));

  var controllerCreator,
    scope,
    ObjectResource,
    DownloadResource, 
    N3Serializer,
    sample;

  // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _ObjectResource_, _DownloadResource_, _N3Serializer_, _sample_) {
        scope = $rootScope.$new();
        sample = _sample_;
        ObjectResource = _ObjectResource_;
        DownloadResource = _DownloadResource_;
        N3Serializer = _N3Serializer_;

      controllerCreator = function() {
          return $controller('MarketHomeCtrl', {
            $scope: scope,
            ObjectResource: ObjectResource,
            DownloadResource: DownloadResource,
            N3Serializer: N3Serializer
          }
        );
      };

    }));

    afterEach(function() {
      ObjectResource.clear();
    });

    it('should load objects', function() {

      ObjectResource.when({}, {entries: [sample().rootCollectionKey]});
      ObjectResource.when({oKey: sample().rootCollectionKey}, sample().oobjectSample);

      controllerCreator();

      scope.$digest();

      expect(scope.items).toBeDefined();
      expect(scope.items.length).toBe(1);
      expect(scope.items[0].meta).toEqualData(sample().sampleN3);
      expect(scope.items[0].oobject).toEqualData(sample().oobjectSample); // Why toBe not true ??
    });

    it('should load object not root', function() {

      ObjectResource.when({}, {entries: [sample().collectionKey]});
      ObjectResource.when({oKey: sample().collectionKey}, sample().oobjectNotRootSample);

      controllerCreator();

      scope.$digest();

      expect(scope.items).toBeDefined();
      expect(scope.items.length).toBe(0);
    });

    it('should load object without metadata', function() {

      ObjectResource.when({}, {entries: [sample().rootCollectionWithoutMetaKey]});
      ObjectResource.when({oKey: sample().rootCollectionWithoutMetaKey}, sample().oobjectWithoutMetaSample);

      controllerCreator();

      scope.$digest();

      expect(scope.items).toBeDefined();
      expect(scope.items.length).toBe(0);
    });

    it('should load object with other meta', function() {

      spyOn(console, 'error');

      ObjectResource.when({}, {entries: [sample().rootCollectionWithOtherMetaKey]});
      ObjectResource.when({oKey: sample().rootCollectionWithOtherMetaKey}, sample().oobjectWithOtherMetaSample);

      controllerCreator();

      scope.$digest();

      expect(scope.items).toBeDefined();
      expect(scope.items.length).toBe(0);
      expect(console.error).toHaveBeenCalledWith('error during process : Enable to download cause key not found');
    });

    it('should not load object', function() {

      spyOn(console, 'error');

      ObjectResource.when({}, {entries: [sample().unknowObjectKey]});

      controllerCreator();

      scope.$digest();

      expect(scope.items).toBeDefined();
      expect(scope.items.length).toBe(0);
      expect(console.error).toHaveBeenCalledWith('unknow object key');
    });
});
