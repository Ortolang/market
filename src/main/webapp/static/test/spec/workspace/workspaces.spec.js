'use strict';

describe('Controller: WorkspacesCtrl', function () {

    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    var WorkspacesCtrl,
        WorkspaceResource,
        Workspace,
        $httpBackend,
        $scope,
        sample,
        $rootScope,
        url,
        $location,
        workspaceListUrl;

    beforeEach(inject(function ($controller, _$rootScope_, _sample_, _$httpBackend_, _url_, _Workspace_, _WorkspaceResource_, _$location_) {
        $httpBackend = _$httpBackend_;
        WorkspaceResource = _WorkspaceResource_;
        Workspace = _Workspace_;
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        sample = _sample_;
        url = _url_;
        workspaceListUrl = url.api + '/workspaces?md=true';
        $location = _$location_;
        WorkspacesCtrl = $controller('WorkspacesCtrl', {
            $scope: $scope,
            WorkspaceResource: WorkspaceResource
        });
        $httpBackend.expect('GET', workspaceListUrl).respond(200, {entries: sample().workspaceList});
        $httpBackend.flush();
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    function hideModal() {
        angular.element('.modal').scope().$hide();
    }

    it('should have a list of my workspaces', function () {
        expect(Workspace.list).toEqualData(sample().workspaceList);
    });

    it('should display a modal when asking to create a workspace', function () {
        $scope.createWorkspace();
        $rootScope.$apply();
        expect(angular.element('.modal').length).toBe(1);
        expect(angular.element('.modal')[0]).toBeDefined();
        hideModal();
        $rootScope.$apply();
    });

    it('should change url when asking to manage a workspace', function () {
        $scope.manageWorkspace({stopPropagation: function () {}}, Workspace.list[0]);
        $rootScope.$apply();
        expect($location.url()).toBe('/workspaces/' + Workspace.list[0].alias);
        $scope.manageWorkspace({stopPropagation: function () {}}, Workspace.list[0], 'foo');
        $rootScope.$apply();
        expect($location.url()).toBe('/workspaces/' + Workspace.list[0].alias + '?section=foo');
    });

    it('should refresh workspace list when added as member of a workspace membership.group.add-member', function () {
        $rootScope.$emit('membership.group.add-member', {fromObject: 'group1', arguments: {member: 'foo'}});
        $rootScope.$digest();
        $rootScope.$emit('membership.group.add-member', {fromObject: 'foobar', arguments: {member: undefined}});
        $httpBackend.expect('GET', workspaceListUrl).respond(200, {entries: sample().workspaceList});
        $rootScope.$digest();
        $httpBackend.flush();
    });

    it('should refresh workspace list when a core.workspace.delete event is intercepted', function () {
        spyOn(WorkspaceResource, 'get').and.callThrough();
        Workspace.active = {workspace: {key: 'system'}};
        $httpBackend.expect('GET', workspaceListUrl).respond(200, {entries: sample().workspaceList});
        $rootScope.$emit('core.workspace.delete', {fromObject: 'system'});
        $rootScope.$digest();
        expect(WorkspaceResource.get).toHaveBeenCalled();
        $httpBackend.flush();
    });

});
