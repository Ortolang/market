'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.sideNavElements
 * @description
 * # sideNavElements
 * Value in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .value('sideNavElements', [
        {
            class: 'home',
            path: '/market/home',
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
            path: '/market/applications',
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
            class: 'divider',
            active: undefined,
            authenticated: false
        },
        {
            class: 'information',
            path: '/information',
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
            description: 'NAV.WORKSPACES',
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
        }
    ]);
