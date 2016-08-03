'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.param
 * @description
 * # param
 * Value in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .value('sample', function () {
        var rootCollectionKey = 'k1',
            rootCollectionWithoutMetaKey = 'k4',
            rootCollectionWithOtherMetaKey = 'k6',
            collectionKey = 'k2',
            unknowMetadataObjectKey = 'k5',
            metadataObjectKey = 'k3',
            unknowObjectKey = 'k7',
            sampleCode = 'sample code',
            publishWorkspaceProcess = {activity: '', initier: 'root', key: '828718e5-cb67-4a69-b822-8c7a5ef2d3b7', log: 'logloglog', name: 'Publication of workspace: System Workspace', state: 'COMPLETED', type: 'publish-workspace'},
            completedProcess = {activity: '', initier: 'root', key: '828718e5-cb67-4a69-b822-8c7a5ef2d3b7', log: 'logloglog', name: 'Publication of workspace: System Workspace', state: 'COMPLETED', type: 'publish-workspace'},
            pendingProcess = {activity: '', initier: 'root', key: '828718e5-cb67-4a69-b822-8c7a5ef2d3b7', log: 'logloglog', name: 'Publication of workspace: System Workspace', state: 'PENDING', type: 'publish-workspace'},
            runningProcess = {activity: 'FOO', initier: 'root', key: '828718e5-cb67-4a69-b822-8c7a5ef2d3b7', log: 'logloglog', name: 'Publication of workspace: System Workspace', state: 'RUNNING', type: 'publish-workspace'},
            sampleN3 = {'http://www.ortolang.fr/ontology/preview': 'k1', image : 'assets/images/no-image.png'},
            workspaceElement = {format: 'market-ortolang-n3'},
            workspaceList = [],
            systemWs = {'key': 'system', 'author': 'root', 'owner': null, 'alias': 'system', 'name': 'System Workspace', 'type': 'SYSTEM', 'clock': 1, 'creationDate': 1433754351268, 'lastModificationDate': 1433926541420, 'members': 'group1', 'head': 'head1', 'changed': true, 'snapshots': []},
            fooWs = {'key': 'foo', 'author': 'root', 'owner': null, 'alias': 'foo', 'name': 'Foo Workspace', 'type': 'SYSTEM', 'clock': 1, 'creationDate': 1433754351268, 'lastModificationDate': 1433926541420, 'members': 'group2', 'head': 'head1', 'changed': false, 'snapshots': []},
            barWs = {'key': 'bar', 'author': 'root', 'owner': null, 'alias': 'bar', 'name': 'Bar Workspace', 'type': 'SYSTEM', 'clock': 1, 'creationDate': 1433754351268, 'lastModificationDate': 1433926541420, 'members': 'group2', 'head': 'head2', 'changed': true, 'snapshots': []},
            profile = {givenName: 'John', familyName: 'Grant', email: 'john.grant@mock.com', emailHash: '389b1742a975233a2a248a01036fad5e', 'emailVisibility': 'EVERYBODY', 'emailVerified': false, 'status': 'ACTIVE', 'groups': ['moderators'], 'complete': true, 'friends': null, 'key': 'jgrant'},
            profileFull = {givenName: 'Foo', familyName: 'Bar', email: 'foo.bar@mock.com', emailHash: 'hash', 'emailVisibility': 'FRIENDS', 'emailVerified': true, 'status': 'ACTIVE', 'groups': ['toto'], 'complete': true, friends: 'friends-group-key', profileDatas: {'foo': 'bar'}, 'key': 'foobar'},
            profileCard = {givenName: 'John', familyName: 'Grant', email: 'john.grant@mock.com', emailHash: '389b1742a975233a2a248a01036fad5e'},
            group1 = {'name': 'Mock group 1', 'members': [], 'key': 'e1f765ef-3aca-446a-bac3-67512dcfdd07'},
            group2 = {'name': 'Mock group 2', 'members': [], 'key': 'e1f765ef-3aca-446a-bac3-67512dcfdd07'},
            friendsGroup = {'name': 'Friends group', 'members': [{key: 'jgrant'}], 'key': 'friends-group-key'},
            head1 = {'key': 'head1', 'service': 'core', 'type': 'collection', 'object': {'metadatas': []}},
            head2 = {'key': 'head2', 'service': 'core', 'type': 'collection', 'object': {'metadatas': [{'name': 'ortolang-item-json', 'key': 'a52a4881-fbd1-4b32-bf73-f782287978db'}]}},
            query1Result = '{"key":"k1","title":"Dede","description":"Description de Dede"}',
            ridItem = '#0:0';

        group1.members.push(profile);
        group2.members.push(profile);
        workspaceList.push(systemWs);
        workspaceList.push(fooWs);
        workspaceList.push(barWs);

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
            workspaceElement: workspaceElement,
            workspaceList: workspaceList,
            profile: profile,
            profileFull: profileFull,
            profileCard: profileCard,
            'friends-group-key': friendsGroup,
            group1: group1,
            group2: group2,
            systemWs: systemWs,
            fooWs: fooWs,
            barWs: barWs,
            head1: head1,
            head2: head2,

            query1Result: query1Result,
            query1Results: [query1Result],
            ridItem: ridItem,
            queryItem: ['{"key":"'+rootCollectionKey+'","ortolang_meta":"'+ridItem+'"}'],

            oobjectSample : {object:{root:true, metadatas: [{key: metadataObjectKey}]}, type: 'collection'},
            oobjectWithoutMetaSample : {object:{root:true, metadatas: []}},
            oobjectWithOtherMetaSample : {object:{root:true, metadatas: [{key: unknowMetadataObjectKey}]}, type: 'collection'},
            oobjectNotRootSample : {object:{root:false, metadatas: [{key: metadataObjectKey}]}},
            metadataOobjectSample : {object: {key: metadataObjectKey},type: 'metadata'},
            fileUploadMock: {"0":{"webkitRelativePath":"","lastModified":1413295331000,"lastModifiedDate":"2014-10-14T14:02:11.000Z","name":"coverage","type":"foo/bar","size":170},"length":1},
            folderUploadMock: {"0":{"webkitRelativePath":"","lastModified":1413295331000,"lastModifiedDate":"2014-10-14T14:02:11.000Z","name":"coverage","type":"","size":170},"length":1},
            list: {entries: [rootCollectionKey, collectionKey, rootCollectionWithoutMetaKey, rootCollectionWithOtherMetaKey, unknowObjectKey]},
            publishWorkspaceProcess: publishWorkspaceProcess,
            completedProcess: completedProcess,
            pendingProcess: pendingProcess,
            runningProcess: runningProcess,
            processList: {entries: [publishWorkspaceProcess]}
        };
    });
