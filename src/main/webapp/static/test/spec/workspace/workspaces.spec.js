'use strict';

describe('Controller: WorkspacesCtrl', function () {

    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));
    beforeEach(module('workspace/templates/publish-modal.html'));
    beforeEach(module('workspace/templates/snapshot-modal.html'));

    var WorkspacesCtrl,
        Settings,
        WorkspaceBrowserService,
        $httpBackend,
        $scope,
        sample,
        $rootScope,
        url,
        $location;

    beforeEach(inject(function ($controller, _$rootScope_, _sample_, _$httpBackend_, _url_, _Settings_, _WorkspaceBrowserService_, _$location_) {
        $httpBackend = _$httpBackend_;
        WorkspaceBrowserService = _WorkspaceBrowserService_;
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        sample = _sample_;
        url = _url_;
        Settings = _Settings_;
        $location = _$location_;
    }));

    describe('with no stored settings', function () {
        beforeEach(inject(function ($controller) {
            WorkspacesCtrl = $controller('WorkspacesCtrl', {
                $scope: $scope,
                Settings: Settings
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

        it('should reinitialize browsing and noFooter when controller is destroyed', function () {
            $scope.$emit('$destroy');
            $rootScope.browsing = false;
            $rootScope.noFooter = false;
        });

        it('should have a list of members of the selected workspace', function () {
            console.log($scope.workspaceMembers);
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

        it('should check if workspace changed before snapshot', function () {
            $scope.snapshot();
            $httpBackend.expect('GET', url.api + '/rest/workspaces/' + WorkspaceBrowserService.workspace.key).respond(200, sample()[WorkspaceBrowserService.workspace.key + 'Ws']);
            $rootScope.$apply();
            $httpBackend.flush();
            console.log(angular.element('.modal')[0]);
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
            expect(angular.element('.foobar')[0]).toBeDefined();
        });

        it('should store in settings workspace defined in search', function () {
            expect(Settings.WorkspaceBrowserService.wskey).not.toBe('foo');
            expect(Settings.WorkspaceBrowserService.wskey).toBe(undefined);
        });
    });

});
