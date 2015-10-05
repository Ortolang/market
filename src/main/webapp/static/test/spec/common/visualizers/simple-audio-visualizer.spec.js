'use strict';

describe('Visualizer: SimpleAudioVisualizer', function () {

    // load the service's module
    beforeEach(module('ortolangMarketAppMock'));
    beforeEach(module('common/visualizers/simple-audio-visualizer/simple-audio-visualizer.html'));

    // instantiate service
    var SimpleAudioVisualizer, element, scope, AuthService;
    beforeEach(inject(function ($rootScope, $compile, _SimpleAudioVisualizer_, _AuthServiceMock_) {
        SimpleAudioVisualizer = _SimpleAudioVisualizer_;
        AuthService = _AuthServiceMock_;
        scope = $rootScope.$new();
        element = angular.element('<div simple-audio-visualizer></div>');
        element = $compile(element)(scope);
        scope.visualizer = {
            header: {},
            content: {},
            footer: {}
        };
        scope.$digest();
    }));

    it('should have a correct config', function () {
        expect(!!SimpleAudioVisualizer).toBe(true);
        expect(SimpleAudioVisualizer.getId()).toEqual('SimpleAudioVisualizer');
        expect(SimpleAudioVisualizer.getName()).toBeDefined();
        expect(SimpleAudioVisualizer.name.fr).toBeDefined();
        expect(SimpleAudioVisualizer.name.en).toBeDefined();
        expect(SimpleAudioVisualizer.getCompatibleTypes()).toBeDefined();
    });

    it('should declare a directive', function () {
        expect(element.html()).toBeDefined();
        expect(element.html().length).toBeGreaterThan(0);
    });
});
