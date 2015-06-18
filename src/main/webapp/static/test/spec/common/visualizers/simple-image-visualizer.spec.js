'use strict';

describe('Visualizer: SimpleImageVisualizer', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('common/visualizers/simple-image-visualizer/simple-image-visualizer.html'));

    // instantiate service
    var SimpleImageVisualizer, element, scope;
    beforeEach(inject(function ($rootScope, _SimpleImageVisualizer_) {
        SimpleImageVisualizer = _SimpleImageVisualizer_;
        scope = $rootScope.$new();
        scope.visualizer = {
            header: {},
            content: {},
            footer: {}
        };
    }));

    it('should have a correct config', function () {
        expect(!!SimpleImageVisualizer).toBe(true);
        expect(SimpleImageVisualizer.getId()).toEqual('SimpleImageVisualizer');
        expect(SimpleImageVisualizer.name.fr).toBeDefined();
        expect(SimpleImageVisualizer.name.en).toBeDefined();
        expect(SimpleImageVisualizer.getCompatibleTypes()).toBeDefined();
    });

    it('should declare a directive', inject(function ($compile) {
        scope.elements = [{}];
        element = angular.element('<div simple-image-visualizer></div>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.html()).toBeDefined();
        expect(element.html().length).toBeGreaterThan(0);
    }));
});
