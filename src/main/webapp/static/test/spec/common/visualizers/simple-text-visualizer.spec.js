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
    }));

    it('should have a correct config', function () {
        expect(!!SimpleTextVisualizer).toBe(true);
        expect(SimpleTextVisualizer.getId()).toEqual('SimpleTextVisualizer');
        expect(SimpleTextVisualizer.getName()).toEqual('Simple Text Visualizer');
        expect(SimpleTextVisualizer.getCompatibleTypes()).toBeDefined();
    });

    //it('should declare a directive', inject(function ($compile) {
    //    element = angular.element('<simple-text-visualizer></simple-text-visualizer>');
    //    element = $compile(element)(scope);
    //    scope.$digest();
    //    expect(element.html()).toBeDefined();
    //    expect(element.html().length).toBeGreaterThan(0);
    //}));
});
