'use strict';

describe('Visualizer: SimpleTextVisualizer', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('common/visualizers/simple-text-visualizer/simple-text-visualizer.html'));

    // instantiate service
    var SimpleTextVisualizer, element, scope;
    beforeEach(inject(function ($rootScope, _SimpleTextVisualizer_) {
        SimpleTextVisualizer = _SimpleTextVisualizer_;
        scope = $rootScope.$new();
        scope.visualizer = {
            header: {},
            content: {},
            footer: {}
        };
        scope.elements = [{}];
    }));

    it('should have a correct config', function () {
        expect(!!SimpleTextVisualizer).toBe(true);
        expect(SimpleTextVisualizer.getId()).toEqual('SimpleTextVisualizer');
        expect(SimpleTextVisualizer.name.fr).toBeDefined();
        expect(SimpleTextVisualizer.name.en).toBeDefined();
        expect(SimpleTextVisualizer.getCompatibleTypes()).toBeDefined();
    });

    //it('should declare a directive', inject(function ($compile) {
    //    element = angular.element('<div simple-text-visualizer></div>');
    //    element = $compile(element)(scope);
    //    scope.$digest();
    //    expect(element.html()).toBeDefined();
    //    expect(element.html().length).toBeGreaterThan(0);
    //}));
});
