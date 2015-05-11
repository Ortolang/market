'use strict';

/**
* @ngdoc function
* @name ortolangMarketApp.controller:side-nav-animation
* @description
* # side-nav-animation
* Animation of the ortolangMarketApp
*/
angular.module('ortolangMarketApp').animation('.side-nav-animation', ['$rootScope', function ($rootScope) {

    return {
        //animation that can be triggered before the class is removed
        beforeRemoveClass: function (element, className, done) {
            console.log('beforeRemoveClass', className, $rootScope.navPosition);
            element.css({top: $rootScope.navPosition});
            done();
        },

        //animation that can be triggered after the class is removed
        removeClass: function (element, className, done) {
            console.log('removeClass', className);
            element.css({top: 0});
            done();
        }
    };
}]);
