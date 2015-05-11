'use strict';

/**
* @ngdoc function
* @name ortolangMarketApp.controller:side-nav-animation
* @description
* # side-nav-animation
* Animation of the ortolangMarketApp
*/
angular.module('ortolangMarketApp').animation('.side-nav-animation', function () {

    return {
        //animation that can be triggered before the class is removed
        beforeRemoveClass: function (element, className, done) {
            element.css({top: parseInt(element.attr('nav-position'), 10)});
            done();
        },

        //animation that can be triggered after the class is removed
        removeClass: function (element, className, done) {
            element.css({top: 0});
            done();
        }
    };
});
