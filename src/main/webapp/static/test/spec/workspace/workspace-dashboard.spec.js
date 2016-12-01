'use strict';

describe('Controller: WorkspaceDashboardCtrl', function () {

    beforeEach(angular.mock.module('ortolangMarketApp'));
    beforeEach(angular.mock.module('ortolangMarketAppMock'));

    var WorkspaceDashboardCtrl,
        Workspace,
        WorkspaceResource,
        ObjectResource,
        StatisticsResource,
        $httpBackend,
        $scope,
        sample,
        $rootScope,
        $routeParams,
        url,
        Helper,
        $location,
        $route,
        $filter;

    beforeEach(inject(function ($controller, _$rootScope_, _$routeParams_, _$route_, _sample_, _$httpBackend_, _url_, _Workspace_, _WorkspaceResource_, _$location_, _ObjectResource_, _$filter_, _StatisticsResource_, _Helper_) {
        $httpBackend = _$httpBackend_;
        WorkspaceResource = _WorkspaceResource_;
        Workspace = _Workspace_;
        ObjectResource = _ObjectResource_;
        StatisticsResource = _StatisticsResource_;
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $route = _$route_;
        $routeParams = _$routeParams_;
        $filter = _$filter_;
        sample = _sample_;
        url = _url_;
        Helper = _Helper_;
        $location = _$location_;
        ObjectResource.when({key: 'head1'}, sample().head1);
        ObjectResource.when({key: 'head2'}, sample().head2);
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('with existing workspace', function () {
        beforeEach(inject(function ($controller) {
            $location.path('/workspaces/foo');
            $rootScope.$digest();
            WorkspaceDashboardCtrl = $controller('WorkspaceDashboardCtrl', {
                $scope: $scope,
                WorkspaceResource: WorkspaceResource,
                StatisticsResource: StatisticsResource
            });
            $httpBackend.expect('GET', url.api + '/workspaces?md=true').respond(200, {entries: sample().workspaceList});
            $httpBackend.expect('GET', url.api + '/workspaces/foo/events?limit=25').respond(200, {entries: {}});
            $httpBackend.expect('GET', url.api + '/workspaces/alias/foo/ftp').respond(200, {});
            $httpBackend.expect('GET', url.api + '/stats/workspaces/foo').respond(200, []);
            $httpBackend.flush();
        }));

        it('should select the workspace according to the path', function () {
            expect($route.current.params.alias).toBe('foo');
            expect(Workspace.active.workspace.alias).toBe('foo');
            expect(Workspace.active.workspace).toEqualData(sample().fooWs);
        });

        it('should not be browsing workspace content by default', function () {
            expect($location.search().browse).toBeFalsy();
        });

        it('should have a list of members of the selected workspace', function () {
            expect(Workspace.active.members).toEqualData(sample().group);
        });

    //    it('should check if workspace changed before snapshot', function () {
    //        $scope.snapshot();
    //        $httpBackend.expect('GET', url.api + '/workspaces/' + WorkspaceBrowserService.workspace.key).respond(200, sample()[WorkspaceBrowserService.workspace.key + 'Ws']);
    //        $rootScope.$apply();
    //        $httpBackend.flush();
    //        expect(angular.element('.modal').length).toBe(1);
    //        hideModal();
    //        $rootScope.$apply();
    //        $scope.changeWorkspace($scope.workspaceList[1]);
    //        $scope.snapshot();
    //        $httpBackend.expect('GET', url.api + '/workspaces/' + WorkspaceBrowserService.workspace.key).respond(200, sample()[WorkspaceBrowserService.workspace.key + 'Ws']);
    //        $httpBackend.expect('GET', 'alert/alert.tpl.html').respond(200, '<div class="alert"></div>');
    //        $rootScope.$apply();
    //        $httpBackend.flush();
    //        expect(angular.element('.modal').length).toBe(0);
    //    });
    //
    //    it('should refresh workspace list and snapshot history when a core.workspace.snapshot event is intercepted', function () {
    //        $rootScope.$emit('core.workspace.snapshot');
    //        $httpBackend.expect('GET', url.api + '/workspaces').respond(200, {entries: sample().workspaceList});
    //        $rootScope.$digest();
    //        $httpBackend.flush();
    //    });
    });

    describe('when workspace does not exist', function () {

        beforeEach(inject(function ($controller) {
            $location.path('/workspaces/foobar');
            $rootScope.$digest();

            WorkspaceDashboardCtrl = $controller('WorkspaceDashboardCtrl', {
                $scope: $scope
            });
            $httpBackend.expect('GET', url.api + '/workspaces?md=true').respond(200, {entries: []});
            $httpBackend.expect('GET', url.api + '/workspaces/alias/foobar?md=true').respond(404, {});
            $httpBackend.flush();
        }));

        it('should display an error modal when workspace does not exist', function () {
            setTimeout(function () {
                expect(Helper.isModalOpened('error')).toEqual(true);
                Helper.hideModal();
                $rootScope.$apply();
            }, 500);
        });
    });

});
