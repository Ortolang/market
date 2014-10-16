'use strict';

describe('Directive: sideNav', function () {

    // load the directive's module
    beforeEach(module('ortolangMarketApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
        element = angular.element('<side-nav></side-nav>');
        element = $compile(element)(scope);
    }));
});
