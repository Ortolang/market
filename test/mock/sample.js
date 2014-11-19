'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.param
 * @description
 * # param
 * Value in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .value('sample', function() {
    	var rootCollectionKey = 'k1',
    		rootCollectionWithoutMetaKey = 'k4',
            rootCollectionWithOtherMetaKey = 'k6',
            collectionKey = 'k2',
            unknowMetadataObjectKey = 'k5',
            metadataObjectKey = 'k3',
            unknowObjectKey = 'k7',
            sampleCode = 'sample code',
            sampleN3 = 'sample n3';

    	return {
	        rootCollectionKey : rootCollectionKey,
	            rootCollectionWithoutMetaKey : rootCollectionWithoutMetaKey,
	            rootCollectionWithOtherMetaKey : rootCollectionWithOtherMetaKey,
	            collectionKey : collectionKey,
	            unknowMetadataObjectKey : unknowMetadataObjectKey,
	            metadataObjectKey : metadataObjectKey,
	            unknowObjectKey : unknowObjectKey,
	            sampleCode : sampleCode,
	            sampleN3 : sampleN3,
	            oobjectSample : {object:{root:true, metadatas: [{key: metadataObjectKey}]}},
	            oobjectWithoutMetaSample : {object:{root:true, metadatas: []}},
	            oobjectWithOtherMetaSample : {object:{root:true, metadatas: [{key: unknowMetadataObjectKey}]}},
	            oobjectNotRootSample : {object:{root:false, metadatas: [{key: metadataObjectKey}]}},
	            list: {entries: [rootCollectionKey, collectionKey, rootCollectionWithoutMetaKey, rootCollectionWithOtherMetaKey, unknowObjectKey]}
	    }
	}
    );