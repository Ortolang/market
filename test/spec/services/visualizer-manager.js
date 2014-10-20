'use strict';

describe('Service: VisualizerManager', function () {

    // load the service's module
    beforeEach(module('ortolangMarketApp'));

    // instantiate service
    var VisualizerManager;
    beforeEach(inject(function (_VisualizerManager_) {
        VisualizerManager = _VisualizerManager_;
    }));

    it('should do something', function () {
        expect(!!VisualizerManager).toBe(true);
    });

//    it('should have an empty registry at initialisation', function () {
//        expect(VisualizerManager.getRegistry()).toBeDefined();
//        expect(VisualizerManager.getRegistry().length).toEqual(0);
//    });

//    it('should be possible to register a new visualizer to the registry', function () {
//        expect(VisualizerManager.registerVisualizer(SimpleAudioVisualizerValue)).toEqual(1);
//    });
//
//    it('should return a list of compatibles visualizer for a given mime type', function () {
//        VisualizerManager.registerVisualizer(SimpleAudioVisualizerValue);
//
//        expect(VisualizerManager.getCompatibleVisualizers('text/plain').length).toEqual(0);
//        expect(VisualizerManager.getCompatibleVisualizers('audio/ogg').length).toEqual(1);
//        expect(VisualizerManager.getCompatibleVisualizers('audio/ogg')[0]).toEqual(SimpleAudioVisualizerValue);
//    });

});
