'use strict';

describe('Service: MetadataFormat', function () {

  // load the service's module
  beforeEach(module('ortolangMarketApp'));

  // instantiate service
  var metadataFormat, MetadataFormat;
  beforeEach(inject(function (_MetadataFormat_) {
    MetadataFormat = _MetadataFormat_;
    // MetadataFormat.setId('michel').setForm('form1');
    metadataFormat = new MetadataFormat({id:'michel'});
  }));

  it('MetadataFormat : should exists', function () {
    expect(!!MetadataFormat).toBe(true);

    expect(metadataFormat.id).toEqual('michel');
    //expect(MetadataFormat.getForm()).toEqual('form1');
  });

});
