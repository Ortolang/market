'use strict';

describe('Visualizer: TextVisualizer', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('common/visualizers/text-visualizer/text-visualizer.html'));
    beforeEach(module('common/visualizers/text-visualizer/text-visualizer-tabs-template.html'));

    // instantiate service
    var TextVisualizer, element, scope;
    beforeEach(inject(function ($rootScope, _TextVisualizer_) {
        TextVisualizer = _TextVisualizer_;
        scope = $rootScope.$new();
        scope.visualizer = {
            header: {},
            content: {},
            footer: {}
        };
        scope.elements = [{}];
    }));

    it('should have a correct config', function () {
        expect(!!TextVisualizer).toBe(true);
        expect(TextVisualizer.getId()).toEqual('TextVisualizer');
        expect(TextVisualizer.name.fr).toBeDefined();
        expect(TextVisualizer.name.en).toBeDefined();
        expect(TextVisualizer.getCompatibleTypes()).toBeDefined();
    });

    //it('should declare a directive', inject(function ($compile) {
    //    element = angular.element('<div text-visualizer></div>');
    //    element = $compile(element)(scope);
    //    scope.$digest();
    //    expect(element.html()).toBeDefined();
    //    expect(element.html().length).toBeGreaterThan(0);
    //}));
});
