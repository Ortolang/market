'use strict';

describe('Constant: icons', function () {

    // load the service's module
    beforeEach(angular.mock.module('ortolangMarketApp'));
    beforeEach(angular.mock.module('ortolangMarketAppMock'));

    // instantiate service
    var icons;
    beforeEach(inject(function (_icons_) {
        icons = _icons_;
    }));

    it('should do something', function () {
        expect(!!icons).toBe(true);
    });

});
