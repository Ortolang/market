'use strict';

describe('Service: VisualizerService', function () {

    beforeEach(module('ortolangMarketApp'));
    beforeEach(module('ortolangMarketAppMock'));

    var VisualizerService,
        fakeVisualizerConfig, fakeVisualizerBisConfig, fakeVisualizerTerConfig, fakeVisualizerQuaterConfig,
        fakeVisualizer, fakeVisualizerBis, fakeVisualizerTer, fakeVisualizerQuater;

    beforeEach(inject(function (_VisualizerService_) {
        VisualizerService = _VisualizerService_;
        fakeVisualizer = VisualizerService.register(fakeVisualizerConfig);
        fakeVisualizerBis = VisualizerService.register(fakeVisualizerBisConfig);
        fakeVisualizerQuater = VisualizerService.register(fakeVisualizerQuaterConfig);
    }));

    fakeVisualizerConfig = {
        id: 'FakeVisualizer',
        templateUrl: 'url.html',
        data: ['element'],
        name: {
            fr: 'Fake Visualizer'
        },
        compatibleTypes: {
            'foo/fake': true,
            'bar/fake': true,
            'foo/bar': false,
            'application/fake-stream': {foo: true, bar: true}
        }
    };

    fakeVisualizerBisConfig = {
        id: 'FakeVisualizerBis',
        templateUrl: 'url.html',
        data: ['element'],
        name: {
            fr: 'Fake Visualizer Bis'
        },
        compatibleTypes: {
            'hello/world': true,
            'application/fake-stream': {hello: true, world: true}
        }
    };

    fakeVisualizerTerConfig = {
        id: 'FakeVisualizerTer',
        templateUrl: 'url.html',
        data: ['element'],
        name: {
            fr: 'Fake Visualizer Ter'
        },
        compatibleTypes: {
            'toto/toto': true,
            'application/fake-stream': true
        }
    };

    fakeVisualizerQuaterConfig = {
        id: 'FakeVisualizerQuater',
        templateUrl: 'url.html',
        data: ['element'],
        name: {
            fr: 'Fake Visualizer Quater'
        },
        acceptMultiple: true,
        compatibleTypes: [
            {
                'toto/toto': true,
                'application/fake-stream': {toto: true}
            },
            {
                'foo/bar': true
            }
        ]
    };

    it('should do something', function () {
        expect(!!VisualizerService).toBe(true);
    });

    it('should not be possible to make a new visualizer with a wrong config', function () {
        var wrongConfig = {};
        expect(VisualizerService.register(wrongConfig)).not.toBeDefined();
        wrongConfig.id = 'wrong';
        expect(VisualizerService.register(wrongConfig)).not.toBeDefined();
        wrongConfig.templateUrl = 'url';
        expect(VisualizerService.register(wrongConfig)).not.toBeDefined();
        wrongConfig.data = ['element'];
        expect(VisualizerService.register(wrongConfig)).not.toBeDefined();
        wrongConfig.compatibleTypes = {'foo': true};
        expect(VisualizerService.register(wrongConfig)).not.toBeDefined();
        wrongConfig.name = {fr: 'Wrong'};
        expect(VisualizerService.register(wrongConfig)).toBeDefined();
        wrongConfig.data = 'element';
        expect(VisualizerService.register(wrongConfig)).not.toBeDefined();
        wrongConfig.data = ['element'];
        wrongConfig.name = 'Wrong';
        expect(VisualizerService.register(wrongConfig)).not.toBeDefined();
    });

    it('should be possible to make a new visualizer', function () {
        expect(fakeVisualizer).toBeDefined();
    });

    it('should be possible to get the visualizer properties', function () {
        expect(fakeVisualizer.getId()).toEqual(fakeVisualizerConfig.id);
        expect(fakeVisualizer.getName()).toEqual(fakeVisualizerConfig.name.fr);
        expect(fakeVisualizer.getCompatibleTypes()).toEqual(fakeVisualizerConfig.compatibleTypes);
    });

    it('should be possible to know if a visualizer is compatible with a mime type', function () {
        expect(fakeVisualizer.isCompatible([{mimeType: 'foo/fake'}])).toBeTruthy();
        expect(fakeVisualizer.isCompatible([{mimeType: 'foo/bar'}])).toBeFalsy();
        expect(fakeVisualizer.isCompatible([{mimeType: 'application/fake-stream', name: 'fake.foo'}])).toBeTruthy();
        expect(fakeVisualizer.isCompatible([{mimeType: 'application/fake-stream', name: 'fake.bar'}])).toBeTruthy();
        expect(fakeVisualizer.isCompatible([{mimeType: 'application/fake-stream', name: 'foobar.fake'}])).toBeFalsy();
    });

    it('should be possible to register a new visualizer', function () {
        var registrySize = VisualizerService.getRegistry().length;
        var newFakeVisualizer = fakeVisualizerConfig;
        newFakeVisualizer.id = 'new';
        VisualizerService.register(newFakeVisualizer);
        expect(VisualizerService.getRegistry().length).toEqual(registrySize + 1);
    });

    it('should not be possible to register a visualizer with an existing id', function () {
        VisualizerService.register(fakeVisualizer);
        expect(VisualizerService.register(fakeVisualizer)).toBeUndefined();
    });

    it('should return a list of compatibles visualizer for a given mime type', function () {
        expect(VisualizerService.getCompatibleVisualizers([{mimeType: 'foo/fake'}]).length).toEqual(1);
        expect(VisualizerService.getCompatibleVisualizers([{mimeType: 'foo/fake'}])[0]).toEqual(fakeVisualizer);
        expect(VisualizerService.getCompatibleVisualizers([{mimeType: 'foo/bar'}]).length).toEqual(0);
    });

    it('should return a list of all supported mime types', function () {
        expect(VisualizerService.getAllSupportedMimeTypes()).toBeDefined();
        expect(VisualizerService.getAllSupportedMimeTypes()['foo/fake']).toBeDefined();
        expect(VisualizerService.getAllSupportedMimeTypes()['hello/world']).toBeDefined();
        expect(VisualizerService.getAllSupportedMimeTypes()['application/fake-stream']).toEqual({foo: true, bar: true, hello: true, world: true, toto: true});
        fakeVisualizerTer = VisualizerService.register(fakeVisualizerTerConfig);
        expect(VisualizerService.getAllSupportedMimeTypes()['application/fake-stream']).toEqual(true);
    });

    it('should accept single element by default', function () {
        expect(fakeVisualizer.isAcceptingSingle()).toBe(true);
        expect(fakeVisualizer.isAcceptingMultiple()).toBe(false);
    });

    it ('should be possible to register a visualizer accepting multiple elements', function () {
        expect(fakeVisualizerQuater.isAcceptingMultiple()).toBe(true);
        expect(fakeVisualizerQuater.isCompatible([{mimeType: 'foo/bar'}])).toBe(false);
        expect(fakeVisualizerQuater.isCompatible([{mimeType: 'foo/bar'}, {mimeType: 'toto/toto'}])).toBe(true);
        expect(fakeVisualizerQuater.isCompatible([{mimeType: 'foo/bar'}, {mimeType: 'application/fake-stream', name: 'test.toto'}])).toBe(true);
        expect(fakeVisualizerQuater.isCompatible([{mimeType: 'foo/bar'}, {mimeType: 'application/fake-stream', name: 'foo.bar'}])).toBe(false);
        expect(fakeVisualizerQuater.isCompatible([{mimeType: 'foo/bar'}, {mimeType: 'foo/bar'}])).toBe(false);
    });

});
