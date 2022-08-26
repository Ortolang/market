'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:avatar
 * @description
 * # avatar
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('avatar', {
        bindings: {
            emailHash: '<',
            size: '@',
            imgClasses: '@'
        },
        template: '<img width="{{$ctrl.size}}px" ng-src="https://www.gravatar.com/avatar/{{$ctrl.emailHash ? $ctrl.emailHash + \'?d=retro\' : \'00000000000000000000000000000000?d=mm\'}}&s={{$ctrl.size}}" ng-class="$ctrl.imgClasses"/>'
    });
