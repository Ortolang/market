'use strict';

describe('Controller: MarketHomeCtrl', function () {

  // load the controller's module
  beforeEach(module('ortolangMarketApp'));

  var MarketHomeCtrl,
    scope,
    ObjectResource,
    DownloadResource, 
    N3Serializer,
    rootCollectionKey = 'k1',
    rootCollectionWithoutMetaKey = 'k4',
    rootCollectionWithOtherMetaKey = 'k6',
    collectionKey = 'k2',
    metadataObjectKey = 'k3',
    unknowObjectKey = 'k7',
    oobjectSample = {object:{root:true, metadatas: [{key: metadataObjectKey}]}},
    oobjectWithoutMetaSample = {object:{root:true, metadatas: []}},
    oobjectWithOtherMetaSample = {object:{root:true, metadatas: [{key: 'K5'}]}},
    oobjectNotRootSample = {object:{root:false, metadatas: [{key: metadataObjectKey}]}},
    n3Sample = 'sample n3';

    // load the controller's module
    beforeEach(function() {

        var mockDownloadResource = {},
          mockObjectResource = {},
          mockN3Serializer = {};

          module('ortolangMarketApp', function($provide) {
            $provide.value('ObjectResource', mockObjectResource);
            $provide.value('DownloadResource', mockDownloadResource);
            $provide.value('N3Serializer', mockN3Serializer);
          });

        inject(function($q) {

            mockObjectResource.list = {entries: [rootCollectionKey, collectionKey, rootCollectionWithoutMetaKey, rootCollectionWithOtherMetaKey, unknowObjectKey]};
            mockObjectResource.data = oobjectSample;
            mockObjectResource.dataNotRoot = oobjectNotRootSample;

            mockObjectResource.get = function(params) {
                var defer = $q.defer();

                if(params.oKey) {
                    if(params.oKey === rootCollectionKey) {
                        defer.resolve(oobjectSample);
                    } else if(params.oKey === collectionKey) {
                        defer.resolve(oobjectNotRootSample);
                    } else if(params.oKey === rootCollectionWithoutMetaKey) {
                        defer.resolve(oobjectWithoutMetaSample);
                    } else if(params.oKey === rootCollectionWithOtherMetaKey) {
                        defer.resolve(oobjectWithOtherMetaSample);
                    } else {
                        defer.reject('unknow object key');
                    }
                } else {
                    defer.resolve(this.list);
                }

                return {$promise: defer.promise};
            };

            mockDownloadResource.data = 'sample code';

            mockDownloadResource.download = function(params) {
                var defer = $q.defer(), data = this.data, successMethod = params.oKey === metadataObjectKey;
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

            mockN3Serializer.data = n3Sample;

            mockN3Serializer.fromN3 = function(content) {
                var defer = $q.defer();

                if(content === 'sample code') {
                    defer.resolve(this.data);
                }

                return defer.promise;
            };

        });
    });

  // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _ObjectResource_, _DownloadResource_, _N3Serializer_) {
        scope = $rootScope.$new();
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
        expect(scope.items[0].meta).toBe(n3Sample);
        expect(scope.items[0].oobject).toBe(oobjectSample);
    });

    // it('should not load objects when it is not a root collection', function() {
    //     oobjectSample = {object:{root:false, metadatas: [{key: 'k2'}]}};

    //     expect(MarketHomeCtrl).toBeDefined();
    //     expect(scope.items).toBeDefined();
    //     expect(scope.items.length).toBe(0);
    // });

});
