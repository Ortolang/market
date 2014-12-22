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
    }));

    it('should have a correct config', function () {
        expect(!!SimpleImageVisualizer).toBe(true);
        expect(SimpleImageVisualizer.getId()).toEqual('SimpleImageVisualizer');
        expect(SimpleImageVisualizer.getName()).toEqual('Simple Image Visualizer');
        expect(SimpleImageVisualizer.getCompatibleTypes()).toBeDefined();
    });

    it('should declare a directive', inject(function ($compile) {
        scope.elements = [{}];
        element = angular.element('<simple-image-visualizer></simple-image-visualizer>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.html()).toBeDefined();
        expect(element.html().length).toBeGreaterThan(0);
    }));

    it('should select the first element if no elements selected', inject(function ($compile) {
        scope.elements = [{}, {}];
        element = angular.element('<simple-image-visualizer></simple-image-visualizer>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.scope().imageElements).toEqualData([{selected: true}, {}]);
    }));

    it('should do nothing if one element is already selected', inject(function ($compile) {
        scope.elements = [{}, {selected: true}];
        element = angular.element('<simple-image-visualizer></simple-image-visualizer>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.scope().imageElements).toEqual(scope.elements);
    }));
});
