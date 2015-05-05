'use strict';

describe('Constant: icons', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    // instantiate service
    var icons;
    beforeEach(inject(function (_icons_) {
        icons = _icons_;
    }));

    it('should do something', function () {
        expect(!!icons).toBe(true);
    });

});
