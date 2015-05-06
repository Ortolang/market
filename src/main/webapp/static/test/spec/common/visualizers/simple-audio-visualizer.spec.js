'use strict';

describe('Visualizer: SimpleAudioVisualizer', function () {

    // load the service's module
    beforeEach(module('ortolangMarketAppMock'));
    beforeEach(module('common/visualizers/simple-audio-visualizer/simple-audio-visualizer.html'));

    // instantiate service
    var SimpleAudioVisualizer, element, scope, AuthService;
    beforeEach(inject(function ($rootScope, $compile, _SimpleAudioVisualizer_, _AuthService_) {
        SimpleAudioVisualizer = _SimpleAudioVisualizer_;
        AuthService = _AuthService_;
        scope = $rootScope.$new();
        element = angular.element('<simple-audio-visualizer></simple-audio-visualizer>');
        element = $compile(element)(scope);
        scope.$digest();
    }));

    it('should have a correct config', function () {
        expect(!!SimpleAudioVisualizer).toBe(true);
        expect(SimpleAudioVisualizer.getId()).toEqual('SimpleAudioVisualizer');
        expect(SimpleAudioVisualizer.getName()).toEqual('Simple Audio Visualizer');
        expect(SimpleAudioVisualizer.getCompatibleTypes()).toBeDefined();
    });

    it('should declare a directive', function () {
        expect(element.html()).toBeDefined();
        expect(element.html().length).toBeGreaterThan(0);
    });
});
