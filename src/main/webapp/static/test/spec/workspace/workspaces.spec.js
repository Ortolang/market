'use strict';

describe('Controller: WorkspacesCtrl', function () {

    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));
    beforeEach(module('workspace/templates/publish-modal.html'));
    beforeEach(module('workspace/templates/snapshot-modal.html'));
    beforeEach(module('workspace/templates/create-workspace-modal.html'));

    var WorkspacesCtrl,
        Settings,
        WorkspaceBrowserService,
        WorkspaceResource,
        $httpBackend,
        $scope,
        sample,
        $rootScope,
        url,
        $location;

    beforeEach(inject(function ($controller, _$rootScope_, _sample_, _$httpBackend_, _url_, _Settings_, _WorkspaceBrowserService_, _WorkspaceResource_, _$location_) {
        $httpBackend = _$httpBackend_;
        WorkspaceBrowserService = _WorkspaceBrowserService_;
        WorkspaceResource = _WorkspaceResource_;
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        sample = _sample_;
        url = _url_;
        Settings = _Settings_;
        $location = _$location_;
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('with no stored settings', function () {
        beforeEach(inject(function ($controller) {
            WorkspacesCtrl = $controller('WorkspacesCtrl', {
                $scope: $scope,
                Settings: Settings,
                WorkspaceResource: WorkspaceResource
            });
            $httpBackend.expect('GET', url.api + '/rest/workspaces').respond(200, sample().workspaceList);
            $httpBackend.flush();
        }));

        it('should not display footer', function () {
            expect($rootScope.noFooter).toBe(true);
        });

        it('should not be browsing workspace content by default', function () {
            expect($rootScope.browsing).toBe(false);
            expect($scope.browserCtrlInitialized).toBe(false);
        });

        it('should be browsing on routeUpdate', function () {
            expect($rootScope.browsing).toBe(false);
            $scope.$emit('$routeUpdate');
            expect($rootScope.browsing).toBe(false);
            $location.search('browse', true);
            $scope.$emit('$routeUpdate');
            expect($rootScope.browsing).toBe(true);
        });

        it('should have a list of my workspaces', function () {
            expect($scope.workspaceList).toEqualData(sample().workspaceList);
        });

        it('should select the first workspace of the list by default', function () {
            expect(WorkspaceBrowserService.workspace).toEqualData(sample().workspaceList.entries[0]);
        });

        it('should put the alias of the selected workspace in the search tags', function () {
            expect($location.search().alias).toBe(sample().workspaceList.entries[0].alias);
        });

        it('should reinitialize browsing and noFooter when controller is destroyed', function () {
            $scope.$emit('$destroy');
            $rootScope.browsing = false;
            $rootScope.noFooter = false;
        });

        it('should have a list of members of the selected workspace', function () {
            expect($scope.workspaceMembers).toEqualData(sample().group);
        });

        it('should display a modal when asking to publish', function () {
            $scope.publish();
            $rootScope.$apply();
            expect(angular.element('.modal').length).toBe(1);
            expect(angular.element('.modal')[0]).toBeDefined();
            angular.element('.modal').scope().$hide();
            $rootScope.$apply();
        });

        it('should be possible to change the workspace', function () {
            $scope.changeWorkspace(WorkspaceBrowserService.workspace);
            $scope.changeWorkspace($scope.workspaceList.entries[1]);
            expect(WorkspaceBrowserService.workspace).toEqualData(sample().workspaceList.entries[1]);
            expect($location.search().alias).toBe(sample().workspaceList.entries[1].alias);
            expect(Settings.WorkspaceBrowserService.wskey).toBe(sample().workspaceList.entries[1].key);
            $scope.changeWorkspace($scope.workspaceList.entries[0]);
        });

        it('should check if workspace changed before snapshot', function () {
            $scope.snapshot();
            $httpBackend.expect('GET', url.api + '/rest/workspaces/' + WorkspaceBrowserService.workspace.key).respond(200, sample()[WorkspaceBrowserService.workspace.key + 'Ws']);
            $rootScope.$apply();
            $httpBackend.flush();
            expect(angular.element('.modal').length).toBe(1);
            angular.element('.modal').scope().$hide();
            $rootScope.$apply();
            $scope.changeWorkspace($scope.workspaceList.entries[1]);
            $scope.snapshot();
            $httpBackend.expect('GET', url.api + '/rest/workspaces/' + WorkspaceBrowserService.workspace.key).respond(200, sample()[WorkspaceBrowserService.workspace.key + 'Ws']);
            $httpBackend.expect('GET', 'alert/alert.tpl.html').respond(200, '<div class="alert"></div>');
            $rootScope.$apply();
            $httpBackend.flush();
            expect(angular.element('.modal').length).toBe(0);
        });

        it('should refresh workspace list when a core.workspace.create event is intercepted', function () {
            spyOn(WorkspaceResource, 'get').and.callThrough();
            $rootScope.$emit('core.workspace.create', {fromObject: 'system'});
            $rootScope.$digest();
            expect(WorkspaceResource.get).not.toHaveBeenCalled();
            $rootScope.$emit('core.workspace.create', {fromObject: 'foobar'});
            $httpBackend.expect('GET', url.api + '/rest/workspaces').respond(200, sample().workspaceList);
            $rootScope.$digest();
            expect(WorkspaceResource.get).toHaveBeenCalled();
            $httpBackend.flush();
        });

        it('should refresh workspace list and snapshot history when a core.workspace.snapshot event is intercepted', function () {
            $rootScope.$emit('core.workspace.snapshot');
            $httpBackend.expect('GET', url.api + '/rest/workspaces').respond(200, sample().workspaceList);
            $rootScope.$digest();
            $httpBackend.flush();
        });

        it('should refresh workspace list when added as member of a workspace membership.group.add-member', function () {
            $rootScope.$emit('membership.group.add-member', {fromObject: 'group1'});
            $rootScope.$digest();
            $rootScope.$emit('membership.group.add-member', {fromObject: 'foobar'});
            $httpBackend.expect('GET', url.api + '/rest/workspaces').respond(200, sample().workspaceList);
            $rootScope.$digest();
            $httpBackend.flush();
        });

        it('should display a modal when asking to create a workspace', function () {
            $scope.createWorkspace();
            $rootScope.$apply();
            expect(angular.element('.modal').length).toBe(1);
            expect(angular.element('.modal')[0]).toBeDefined();
            angular.element('.modal').scope().$hide();
            $rootScope.$apply();
        });
    });

    describe('with settings', function () {
        beforeEach(inject(function ($controller) {
            Settings.WorkspaceBrowserService.wskey = 'foo';

            WorkspacesCtrl = $controller('WorkspacesCtrl', {
                $scope: $scope,
                Settings: Settings
            });
            $httpBackend.expect('GET', url.api + '/rest/workspaces').respond(200, sample().workspaceList);
            $httpBackend.flush();
        }));

        it('should select my workspace stored in the settings', function () {
            expect(WorkspaceBrowserService.workspace.key).toBe('foo');
        });
    });

    describe('with settings but workspace doesn\'t exist anymore', function () {
        beforeEach(inject(function ($controller) {
            Settings.WorkspaceBrowserService.wskey = 'foobar';

            WorkspacesCtrl = $controller('WorkspacesCtrl', {
                $scope: $scope,
                Settings: Settings
            });
            $httpBackend.expect('GET', url.api + '/rest/workspaces').respond(200, sample().workspaceList);
            $httpBackend.flush();
        }));

        it('should select the first workspace of the list if the one stored in settings doesn\'t exist anymore', function () {
            expect(WorkspaceBrowserService.workspace.key).not.toBe('foobar');
            expect(WorkspaceBrowserService.workspace.key).toBe(sample().workspaceList.entries[0].key);
        });
    });

    describe('with alias', function () {
        beforeEach(inject(function ($controller) {
            Settings.WorkspaceBrowserService.wskey = 'foo';
            $location.search('alias', 'bar');

            WorkspacesCtrl = $controller('WorkspacesCtrl', {
                $scope: $scope,
                Settings: Settings
            });
            $httpBackend.expect('GET', url.api + '/rest/workspaces').respond(200, sample().workspaceList);
            $httpBackend.flush();
        }));

        it('should select the workspace in search if defined', function () {
            expect(WorkspaceBrowserService.workspace.key).not.toBe('foo');
            expect(WorkspaceBrowserService.workspace.key).toBe('bar');
        });

        it('should store in settings workspace defined in search', function () {
            expect(Settings.WorkspaceBrowserService.wskey).not.toBe('foo');
            expect(Settings.WorkspaceBrowserService.wskey).toBe('bar');
        });
    });

    describe('for user with no workspaces', function () {

        beforeEach(inject(function ($controller) {
            Settings.WorkspaceBrowserService.wskey = 'foo';
            $location.search('alias', 'bar');

            WorkspacesCtrl = $controller('WorkspacesCtrl', {
                $scope: $scope,
                Settings: Settings
            });
            $httpBackend.expect('GET', url.api + '/rest/workspaces').respond(200, {entries: []});
            $httpBackend.expect('GET', 'modal/modal.tpl.html').respond(200, '<div class="modal foobar"></div>');
            $httpBackend.flush();
        }));

        it('should display an error modal when workspace defined in search doesn\'t exist in list', function () {
            expect(angular.element('.foobar').length).toBe(1);
        });

        it('should store in settings workspace defined in search', function () {
            expect(Settings.WorkspaceBrowserService.wskey).not.toBe('foo');
            expect(Settings.WorkspaceBrowserService.wskey).toBe(undefined);
        });
    });

});
