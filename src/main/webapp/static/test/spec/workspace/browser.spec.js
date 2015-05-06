'use strict';

describe('Controller: BrowserCtrl', function () {

    // load the controller's module
    beforeEach(module('ortolangMarketApp'));

    var BrowserCtrl,
        //mockWorkspaceElementResource,
        $scope,
        $rootScope,
        $q,
        $httpBackend,
        url,
        $routeParams;

        //mockParentData = {
        //    'pathParts': [],
        //    'key': '986a419a-beff-4a3a-b82f-e3d258ff2754',
        //    'workspace': 'system',
        //    'name': 'root',
        //    'clock': 1,
        //    'size': 19,
        //    'description': 'Root collection of workspace "System Workspace"',
        //    'preview': null,
        //    'stream': null,
        //    'type': 'collection',
        //    'mimetype': 'text/directory',
        //    'format': null,
        //    'target': null,
        //    'modification': 1414142656719,
        //    'creation': 1414137707733,
        //    'elements': [{'type': 'object', 'name': 'ORTOLANG_ATILF_Pre_sentation_20140924.pdf', 'modification': 1414142655254, 'mimeType': 'application/pdf', 'key': 'c5ab65ff-0f16-4828-8630-e579d4afeab6'}],
        //    'metadatas': [],
        //    'path': '/'
        //};

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, _$rootScope_, _$q_, _$httpBackend_, _url_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $q = _$q_;
        url = _url_;
        $routeParams =  {wsName: 'system', root: 'head', path: '/'};
        $httpBackend = _$httpBackend_;

        //var queryPromise = $q.defer();

        //var url = url.api() + '/rest/workspaces/' + $routeParams.wsName + '/elements';
        //url += '?path=%2F&root=head';
        //$httpBackend.whenGET(url).respond(queryPromise.promise.then(undefined, undefined));
        //console.log(url);

        //var getResponse = parentData(),
        //    queryPromise = $q.defer();
        //var MockWorkspaceElementResource = jasmine.createSpyObj('ParentStub', ['get']);
        //MockWorkspaceElementResource.get.andCallFake(function (success, error) {queryPromise.promise.then(success, error); });

        //mockWorkspaceElementResource = {
        //    get: function () {
        //        getDeferred = $q.defer();
        //        var getPromise = getDeferred.promise;
        //        var data = parentData();
        //        data.$promise = getPromise;
        //        return data;
        //    }
        //};

        //getDeferred.resolve(parentData());
        //$rootScope.$apply();

        BrowserCtrl = $controller('BrowserCtrl', {
            '$scope': $scope,
            '$routeParams': $routeParams
            //WorkspaceElementResource: new MockWorkspaceElementResource()
        });
    }));

    //it('should getParentData', function () {
    //    console.log($scope.wsName);
    //    expect($scope.parent).toBeDefined();
    //});
    //
    //it('should have parent selected by default', function () {
    //    expect($scope.isSelected($scope.parent)).toBe(true);
    //});

});
