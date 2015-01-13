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

      ObjectResource.when({items: 'true', status: 'PUBLISHED'}, {entries: [sample().rootCollectionKey]});
      ObjectResource.when({oKey: sample().rootCollectionKey}, sample().oobjectSample);

      controllerCreator();

      scope.$digest();

      expect(scope.items).toBeDefined();
      expect(scope.items.length).toBe(1);
      expect(scope.items[0]).toEqualData({ key : sample().rootCollectionKey });
    });

});
