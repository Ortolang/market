'use strict';

describe('Controller: MarketHomeCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));
  beforeEach(module('ortolangMarketAppMock'));

  var MarketHomeCtrl,
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

        MarketHomeCtrl = $controller('MarketHomeCtrl', {
          $scope: scope,
          ObjectResource: ObjectResource,
          DownloadResource: DownloadResource,
          N3Serializer: N3Serializer
        });
        scope.$digest();
    }));

    it('should load objects', function() {
        expect(MarketHomeCtrl).toBeDefined();
        expect(scope.items).toBeDefined();
        expect(scope.items.length).toBe(1);
        expect(scope.items[0].meta).toBe(sample().sampleN3);
        expect(scope.items[0].oobject).toEqualData(sample().oobjectSample); // Why toBe not true ??
    });

});
