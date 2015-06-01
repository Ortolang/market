'use strict';

describe('Visualizer: SimpleVideoVisualizer', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('common/visualizers/simple-video-visualizer/simple-video-visualizer.html'));

    // instantiate service
    var SimpleVideoVisualizer, element, scope;
    beforeEach(inject(function ($rootScope, $compile, _SimpleVideoVisualizer_) {
        SimpleVideoVisualizer = _SimpleVideoVisualizer_;
        scope = $rootScope.$new();
        scope.visualizer = {
            header: {},
            content: {},
            footer: {}
        };
        element = angular.element('<div simple-video-visualizer></div>');
        element = $compile(element)(scope);
        scope.$digest();
    }));

    it('should have a correct config', function () {
        expect(!!SimpleVideoVisualizer).toBe(true);
        expect(SimpleVideoVisualizer.getId()).toEqual('SimpleVideoVisualizer');
        expect(SimpleVideoVisualizer.getName()).toEqual('Simple Video Visualizer');
        expect(SimpleVideoVisualizer.getCompatibleTypes()).toBeDefined();
    });

    it('should declare a directive', function () {
        expect(element.html()).toBeDefined();
        expect(element.html().length).toBeGreaterThan(0);
    });
});
