'use strict';

describe('Controller: MarketHomeCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));
  beforeEach(module('ortolangMarketAppMock'));

  var controllerCreator,
    scope,
    JsonResultResource,
    sample;

  // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _JsonResultResource_, _sample_) {
        scope = $rootScope.$new();
        sample = _sample_;
        JsonResultResource = _JsonResultResource_;

      controllerCreator = function(routeParams) {
        return $controller('MarketHomeCtrl', {
            $scope: scope,
            $routeParams: routeParams,
            JsonResultResource: JsonResultResource
        }
        );
      };

    }));

    afterEach(function() {
      JsonResultResource.clear();
    });

    it('should load objects', function() {
      var ortolangType = 'Corpus';
      var query = 'select ortolang_key as key, ortolang_meta.title as title, ortolang_meta.description, ortolang_meta.image as image from OrtolangObject where ortolang_status = \'published\' and ortolang_meta.type = \''+ortolangType+'\'';
      JsonResultResource.when({query:query}, sample().query1Results);

      controllerCreator({section: 'corpora'});

      scope.$digest();

      expect(scope.items).toBeDefined();
      expect(scope.items.length).toBe(1);
    });
});
