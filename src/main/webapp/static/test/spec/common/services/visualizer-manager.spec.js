'use strict';

describe('Service: VisualizerManager', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    // instantiate service
    var VisualizerManager, VisualizerFactory,
        fakeVisualizerConfig, fakeVisualizerBisConfig, fakeVisualizerTerConfig, fakeVisualizerQuaterConfig,
        fakeVisualizer, fakeVisualizerBis, fakeVisualizerTer, fakeVisualizerQuater;
    beforeEach(inject(function (_VisualizerManager_, _VisualizerFactory_) {
        VisualizerManager = _VisualizerManager_;
        VisualizerFactory = _VisualizerFactory_;
        fakeVisualizer = VisualizerFactory.make(fakeVisualizerConfig);
        fakeVisualizerBis = VisualizerFactory.make(fakeVisualizerBisConfig);
        fakeVisualizerTer = VisualizerFactory.make(fakeVisualizerTerConfig);
        fakeVisualizerQuater = VisualizerFactory.make(fakeVisualizerQuaterConfig);
    }));

    fakeVisualizerConfig = {
        id: 'FakeVisualizer',
        name: 'Fake Visualizer',
        compatibleTypes: {
            'foo/fake': true,
            'bar/fake': true,
            'foo/bar': false,
            'application/fake-stream': {foo: true, bar: true}
        }
    };

    fakeVisualizerBisConfig = {
        id: 'FakeVisualizerBis',
        compatibleTypes: {
            'hello/world': true,
            'application/fake-stream': {hello: true, world: true}
        }
    };

    fakeVisualizerTerConfig = {
        id: 'FakeVisualizerTer',
        compatibleTypes: {
            'toto/toto': true,
            'application/fake-stream': true
        }
    };

    fakeVisualizerQuaterConfig = {
        id: 'FakeVisualizerQuater',
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
        expect(!!VisualizerManager).toBe(true);
    });

    it('should have a registry', function () {
        expect(VisualizerManager.getRegistry()).toBeDefined();
    });

    it('should not be possible to make a new visualizer with a wrong config', function () {
        var wrongConfig = {};
        expect(VisualizerFactory.make(wrongConfig)).not.toBeDefined();
        wrongConfig.id = 'wrong';
        expect(VisualizerFactory.make(wrongConfig)).not.toBeDefined();
        wrongConfig.compatibleTypes = {'foo': true};
        expect(VisualizerFactory.make(wrongConfig)).not.toBeDefined();
        wrongConfig.id = 'Wrong';
        expect(VisualizerFactory.make(wrongConfig)).toBeDefined();
    });

    it('should be possible to make a new visualizer', function () {
        expect(fakeVisualizer).toBeDefined();

    });

    it('should be possible to get the visualizer properties', function () {
        expect(fakeVisualizer.getId()).toEqual(fakeVisualizerConfig.id);
        expect(fakeVisualizer.getName()).toEqual(fakeVisualizerConfig.name);
        expect(fakeVisualizerBis.getName()).toEqual(fakeVisualizerBisConfig.id);
        expect(fakeVisualizer.getDescription()).toEqual(undefined);
        expect(fakeVisualizer.getCompatibleTypes()).toEqual(fakeVisualizerConfig.compatibleTypes);
        expect(fakeVisualizer.getElement()).toEqual('<fake-visualizer></fake-visualizer>');
    });

    it('should be possible to know if a visualizer is compatible with a mime type', function () {
        expect(fakeVisualizer.isCompatible([{mimeType: 'foo/fake'}])).toBeTruthy();
        expect(fakeVisualizer.isCompatible([{mimeType: 'foo/bar'}])).toBeFalsy();
        expect(fakeVisualizer.isCompatible([{mimeType: 'application/fake-stream', name: 'fake.foo'}])).toBeTruthy();
        expect(fakeVisualizer.isCompatible([{mimeType: 'application/fake-stream', name: 'fake.bar'}])).toBeTruthy();
        expect(fakeVisualizer.isCompatible([{mimeType: 'application/fake-stream', name: 'foobar.fake'}])).toBeFalsy();
    });

    it('should be possible to register a new visualizer', function () {
        var registrySize = VisualizerManager.getRegistry().length;
        expect(VisualizerManager.register(fakeVisualizer)).toEqual(registrySize + 1);
    });

    it('should not be possible to register a visualizer with an existing id', function () {
        VisualizerManager.register(fakeVisualizer);
        expect(VisualizerManager.register(fakeVisualizer)).toBeUndefined();
    });

    it('should return a list of compatibles visualizer for a given mime type', function () {
        VisualizerManager.register(fakeVisualizer);
        expect(VisualizerManager.getCompatibleVisualizers([{mimeType: 'foo/fake'}]).length).toEqual(1);
        expect(VisualizerManager.getCompatibleVisualizers([{mimeType: 'foo/fake'}])[0]).toEqual(fakeVisualizer);
        expect(VisualizerManager.getCompatibleVisualizers([{mimeType: 'foo/bar'}]).length).toEqual(0);
    });

    it('should return a list of all supported mime types', function () {
        VisualizerManager.register(fakeVisualizer);
        VisualizerManager.register(fakeVisualizerBis);
        expect(VisualizerManager.getAllSupportedMimeTypes()).toBeDefined();
        expect(VisualizerManager.getAllSupportedMimeTypes()['foo/fake']).toBeDefined();
        expect(VisualizerManager.getAllSupportedMimeTypes()['hello/world']).toBeDefined();
        expect(VisualizerManager.getAllSupportedMimeTypes()['foo/bar']).not.toBeDefined();
        expect(VisualizerManager.getAllSupportedMimeTypes()['application/fake-stream']).toEqual({foo: true, bar: true, hello: true, world: true});
        VisualizerManager.register(fakeVisualizerTer);
        expect(VisualizerManager.getAllSupportedMimeTypes()['application/fake-stream']).toEqual(true);
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
