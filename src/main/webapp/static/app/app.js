'use strict';

/**
 * @ngdoc overview
 * @name ortolangMarketApp
 * @description
 * # ortolangMarketApp
 *
 * Main module of the application.
 */
angular
    .module('ortolangMarketApp', [
        'ngAnimate',
        'ngRoute',
        'ngResource',
        'ngMessages',
        'ngSanitize',
        'ortolangVisualizers',
        'angularFileUpload',
        'mgcrea.ngStrap.tab',
        'mgcrea.ngStrap.modal',
        'mgcrea.ngStrap.aside',
        'mgcrea.ngStrap.helpers.dimensions',
        'mgcrea.ngStrap.tooltip',
        'mgcrea.ngStrap.dropdown',
        'mgcrea.ngStrap.typeahead',
        'mgcrea.ngStrap.alert',
        'mgcrea.ngStrap.button',
        'toggle-switch',
        'hljs',
        'cfp.hotkeys',
        'formly',
        'formlyBootstrap',
        'ui.bootstrap.showErrors',
        'pascalprecht.translate',
        'zeroclipboard',
        'diff-match-patch',
        'angular-md5',
        'xeditable',
        'schemaForm',
        'ngTagsInput',
        'angularMoment'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/market/home'
            })
            .when('/market/home', {
                templateUrl: 'market/home.html',
                controller: 'HomeCtrl',
                title: 'NAV.HOME'
            })
            .when('/market/corpora', {
                templateUrl: 'market/corpora.html',
                title: 'CORPORA',
                reloadOnSearch: false
            })
            .when('/market/tools', {
                templateUrl: 'market/tools.html',
                title: 'TOOLS',
                reloadOnSearch: false
            })
            .when('/market/lexicons', {
                templateUrl: 'market/lexicons.html',
                title: 'LEXICONS',
                reloadOnSearch: false
            })
            .when('/market/applications', {
                templateUrl: 'market/applications.html',
                title: 'INTEGRATED_PROJECTS'
            })
            .when('/market/:section/:itemKey', {
                templateUrl: 'market/market-item.html',
                controller: 'MarketItemCtrl',
                reloadOnSearch: false
            })
            .when('/market/search', {
                templateUrl: 'market/search.html',
                title: 'SEARCH',
                reloadOnSearch: false
            })
            .when('/producers', {
                templateUrl: 'producer/producers.html',
                title: 'PRODUCERS'
            })
            .when('/producers/:producerId', {
                templateUrl: 'producer/producer.html'
            })
            .when('/workspaces', {
                templateUrl: 'workspace/workspaces.html',
                requiresAuthentication: true,
                reloadOnSearch: false,
                controller: 'WorkspacesCtrl',
                title: 'NAV.WORKSPACES'
            })
            .when('/processes', {
                templateUrl: 'processes/processes.html',
                controller: 'ProcessesCtrl',
                requiresAuthentication: true,
                title: 'NAV.PROCESSES'
            })
            .when('/tasks', {
                templateUrl: 'tasks/tasks.html',
                controller: 'TasksCtrl',
                requiresAuthentication: true,
                title: 'NAV.TASKS'
            })
            .when('/information', {
                redirectTo: '/information/presentation'
            })
            .when('/information/:section', {
                templateUrl: 'common/staticSite/information.html',
                controller: 'InformationCtrl',
                reloadOnSearch: false,
                title: 'NAV.INFORMATION'
            })
            .when('/profile', {
                templateUrl: 'profile/profile.html',
                controller: 'ProfileCtrl',
                requiresAuthentication: true,
                resolve: {
                    func: ['AuthService', function (AuthService) {
                        return AuthService.sessionInitialized;
                    }]
                },
                title: 'NAV.PROFILE'
            })
            .when('/404', {
                templateUrl: '404.html',
                title: 'NAV.404'
            })
            .otherwise({
                redirectTo: '/404'
            });
    }])
    .config(['$sceDelegateProvider', function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            OrtolangConfig.apiServerUrlDefault + '**',
            OrtolangConfig.apiServerUrlNoSSL + '**'
        ]);
    }])
    .config(['$tooltipProvider', '$alertProvider', function ($tooltipProvider, $alertProvider) {
        angular.extend($tooltipProvider.defaults, {
            container: 'body',
            trigger: 'hover click'
        });
        angular.extend($alertProvider.defaults, {
            container: '.alerts-wrapper',
            placement: 'top-right'
        });
    }])
    .config(['hotkeysProvider', function (hotkeysProvider) {
        hotkeysProvider.cheatSheetDescription = undefined;
    }])
    .config(['uiZeroclipConfigProvider', function (uiZeroclipConfigProvider) {
        uiZeroclipConfigProvider.setZcConf({
            swfPath: '/vendor/ZeroClipboard.swf'
        });
    }])
    .run(['editableOptions', 'editableThemes', function (editableOptions, editableThemes) {
        var copy = editableThemes.bs3;
        copy.formTpl = '<form class="" role="form"></form>';
        copy.controlsTpl = '<div class="editable-controls input-group" ng-class="{\'has-error\': $error, \'input-group-lg\': largeInput}"></div>';
        copy.buttonsTpl = '<span class="input-group-btn"></span>';
        copy.submitTpl = '<button type="submit" class="btn btn-default"><span></span></button>';
        editableThemes.bs3 = copy;
        editableOptions.theme = 'bs3';
    }]);


/**
 * @ngdoc overview
 * @name ortolangVisualizers
 * @description
 * # ortolangVisualizers
 *
 * Ortolang Visualizers Module
 */
angular.module('ortolangVisualizers', [
    'ortolangMarketApp',
    'pascalprecht.translate'
]);

