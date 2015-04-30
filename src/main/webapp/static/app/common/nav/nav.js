'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Nav
 * @description
 * # Nav
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('Nav', function () {

        var sideNavElements = [
            {
                class: 'market',
                path: '/market/news',
                description: 'NAV.HOME',
                iconCss: 'fa fa-fw fa-home fa-2x',
                active: undefined,
                hiddenSideNav: false,
                hiddenTopNav: false,
                authenticated: false
            },
            {
                class: 'corpora',
                path: '/market/corpora',
                description: 'CORPORA',
                iconCss: 'fa fa-fw fa-book fa-2x',
                active: undefined,
                hiddenSideNav: false,
                hiddenTopNav: false,
                authenticated: false
            },
            {
                class: 'integrated-projects',
                path: '/market/websites',
                description: 'INTEGRATED_PROJECTS',
                iconCss: 'fa fa-fw fa-briefcase fa-2x',
                active: undefined,
                hiddenSideNav: false,
                hiddenTopNav: false,
                authenticated: false
            },
            {
                class: 'tools',
                path: '/market/tools',
                description: 'TOOLS',
                iconCss: 'fa fa-fw fa-cubes fa-2x',
                active: undefined,
                hiddenSideNav: false,
                hiddenTopNav: false,
                authenticated: false
            },
            {
                class: 'lexicons',
                path: '/market/lexicons',
                description: 'LEXICONS',
                iconCss: 'fa fa-fw fa-quote-right fa-2x',
                active: undefined,
                hiddenSideNav: false,
                hiddenTopNav: false,
                authenticated: false
            },
            {
                class: 'item',
                path: '/market/item',
                description: 'NAV.ITEM',
                iconCss: 'fa fa-fw fa-cube fa-2x',
                active: undefined,
                hiddenSideNav: true,
                hiddenTopNav: true,
                authenticated: false
            },
            {
                class: 'divider',
                active: undefined,
                authenticated: false
            },
            {
                class: 'information',
                path: '/information',
                hiddenPath: '/information/presentation',
                description: 'NAV.INFORMATION',
                iconCss: 'fa fa-fw fa-info fa-2x',
                active: undefined,
                hiddenSideNav: false,
                hiddenTopNav: false,
                authenticated: false
            },
            {
                class: 'workspaces',
                path: '/workspaces',
                description: 'NAV.MY_WORKSPACES',
                iconCss: 'fa fa-fw fa-cloud fa-2x',
                active: undefined,
                hiddenSideNav: false,
                hiddenTopNav: false,
                authenticated: true
            },
            {
                class: 'processes',
                path: '/processes',
                description: 'NAV.PROCESSES',
                iconCss: 'fa fa-fw fa-tasks fa-2x',
                active: undefined,
                hiddenSideNav: true,
                hiddenTopNav: false,
                authenticated: true
            },
            {
                class: 'tasks',
                path: '/tasks',
                description: 'NAV.TASKS',
                iconCss: 'fa fa-fw fa-bell fa-2x',
                active: undefined,
                hiddenSideNav: true,
                hiddenTopNav: false,
                authenticated: true
            },
            {
                class: 'profile',
                path: '/profile',
                hiddenPath: '/profile/personal-infos',
                description: 'NAV.PROFILE',
                iconCss: 'fa fa-fw fa-user fa-2x',
                active: undefined,
                hiddenSideNav: true,
                hiddenTopNav: true,
                authenticated: true
            },
            {
                class: 'search',
                path: '/search',
                description: 'NAV.SEARCH',
                iconCss: 'fa fa-fw fa-search fa-2x',
                active: undefined,
                hiddenSideNav: true,
                hiddenTopNav: true,
                authenticated: true
            },
            {
                class: '404',
                path: '/404',
                description: 'NAV.404',
                iconCss: 'fa fa-fw fa-exclamation fa-2x',
                active: undefined,
                hiddenSideNav: true,
                hiddenTopNav: true,
                authenticated: true
            }
        ];

        return {
            getSideNavElements: function () {
                return sideNavElements;
            }
        };
    });
