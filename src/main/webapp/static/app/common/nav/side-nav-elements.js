'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.sideNavElements
 * @description
 * # sideNavElements
 * Constant in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .constant('sideNavElements', [
        {
            id: 'home',
            class: 'home',
            path: '/',
            description: 'NAV.HOME',
            iconCss: 'fa fa-fw fa-home fa-2x',
            hiddenSideNav: false,
            hiddenTopNav: false,
            authenticated: false
        },
        {
            id: 'corpora',
            class: 'corpora',
            path: '/market/corpora',
            description: 'CORPORA',
            iconCss: 'fa fa-fw fa-book fa-2x',
            hiddenSideNav: false,
            hiddenTopNav: false,
            authenticated: false
        },
        {
            id: 'applications',
            class: 'applications',
            path: '/market/applications',
            description: 'INTEGRATED_PROJECTS',
            iconCss: 'fa fa-fw fa-briefcase fa-2x',
            hiddenSideNav: false,
            hiddenTopNav: false,
            authenticated: false
        },
        {
            id: 'tools',
            class: 'tools',
            path: '/market/tools',
            description: 'TOOLS',
            iconCss: 'fa fa-fw fa-cubes fa-2x',
            hiddenSideNav: false,
            hiddenTopNav: false,
            authenticated: false
        },
        {
            id: 'lexicons',
            class: 'lexicons',
            path: '/market/lexicons',
            description: 'LEXICONS',
            iconCss: 'fa fa-fw fa-quote-right fa-2x',
            hiddenSideNav: false,
            hiddenTopNav: false,
            authenticated: false
        },
        {
            id: 'divider',
            class: 'divider',
            authenticated: false
        },
        {
            id: 'information',
            class: 'information',
            path: '/information',
            description: 'NAV.INFORMATION',
            iconCss: 'fa fa-fw fa-info fa-2x',
            hiddenSideNav: false,
            hiddenTopNav: false,
            authenticated: false
        },
        {
            id: 'producers',
            class: 'producers',
            path: '/producers',
            description: 'NAV.PRODUCERS',
            iconCss: 'fa fa-fw fa-graduation-cap fa-2x',
            hiddenSideNav: false,
            hiddenTopNav: false,
            authenticated: false
        },
        {
            id: 'divider2',
            class: 'divider',
            authenticated: false
        },
        {
            id: 'workspaces',
            class: 'workspaces',
            path: '/workspaces',
            description: 'NAV.WORKSPACES',
            iconCss: 'fa fa-fw fa-cloud fa-2x',
            hiddenSideNav: false,
            hiddenTopNav: false,
            authenticated: true
        }
    ]);
