'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Workspace
 * @description
 * # Workspace
 * Factory in the ortolangMarketApp.
 * @property {Array}    list        - the workspace list of the connected user
 * @property {Object}   metadatas   - the metadata of all the workspaces in the list
 * @property {Object}   active      - the workspace being managed
 * @property {Object}   authorCards - the cards of all the authors related to the active workspace
 */
angular.module('ortolangMarketApp').service('Workspace', ['$rootScope', '$filter', '$location', '$q', 'ProfileResource', 'WorkspaceResource', 'WorkspaceElementResource', 'GroupResource', 'ObjectResource', 'EventFeedResource', 'RuntimeResource', 'SubscriptionResource', 'Content', 'User', 'Helper', function ($rootScope, $filter, $location, $q, ProfileResource, WorkspaceResource, WorkspaceElementResource, GroupResource, ObjectResource, EventFeedResource, RuntimeResource, SubscriptionResource, Content, User, Helper) {

    var listDeferred,
        activeWorkspaceInfoDeferred,
        Workspace = this;

    this.active = {};

    this.authorCards = {};

    this.metadatas = {};

    this.list = null;

    this.refresh = {};

    this.getWorkspaceList = function (noRefresh) {
        if (noRefresh && !!this.list) {
            listDeferred.resolve(this.list);
        } else {
            listDeferred = $q.defer();
            WorkspaceResource.get({md: true}, function (data) {
                Workspace.list = data.entries;
                listDeferred.resolve(data.entries);
            }, function () {
                listDeferred.reject();
            });
        }
        return listDeferred.promise;
    };

    function getWorkspaceMetadata(workspace) {
        var deferred = $q.defer();
        Workspace.metadatas[workspace.alias] = undefined;
        if (workspace.metadatas && workspace.metadatas['ortolang-item-json']) {
            Content.downloadWithKey(workspace.metadatas['ortolang-item-json']).promise.then(function (data) {
                var metadata = angular.fromJson(data.data);
                if (metadata.image) {
                    metadata.imageUrl = Content.getContentUrlWithPath(metadata.image, workspace.alias, metadata.snapshotName);
                } else {
                    metadata.imageUrl = null;
                }
                Workspace.metadatas[workspace.alias] = metadata;
                deferred.resolve(metadata);
            }, function () {
                deferred.reject();
            });
        } else {
            Workspace.metadatas[workspace.alias] = null;
            deferred.resolve(null);
        }
        return deferred.promise;
    }

    function getCard(username) {
        if (username && Workspace.authorCards[username] === undefined) {
            Workspace.authorCards[username] = null;
            ProfileResource.getCard({key: username}, function (data) {
                Workspace.authorCards[username] = data;
            });
        }
    }

    this.getWorkspacesMetadata = function () {
        angular.forEach(Workspace.list, function (workspace) {
            getCard(workspace.author);
            getWorkspaceMetadata(workspace);
        });
    };

    this.getWorkspaceTitle = function (workspace) {
        var metadata = Workspace.metadatas[workspace.alias];
        if (metadata === null) {
            return workspace.name;
        }
        if (metadata === undefined) {
            return undefined;
        }
        if (metadata.title) {
            return Helper.getMultilingualValue(metadata.title);
        }
    };

    this.getActiveWorkspaceTitle = function () {
        return this.getWorkspaceTitle(Workspace.active.workspace);
    };

    this.clearActiveWorkspace = function () {
        this.active = {};
    };


    function getActiveWorkspaceInfo() {
        var promises = [];
        activeWorkspaceInfoDeferred = $q.defer();
        getCard(Workspace.active.workspace.author);
        getCard(Workspace.active.workspace.owner);
        promises.push(Workspace.getActiveWorkspaceMetadata());
        promises.push(Workspace.getActiveWorkspaceMembers());
        promises.push(Workspace.getActiveWorkspaceEvents());
        promises.push(Workspace.getActiveWorkspaceHead());
        promises.push(Workspace.getActiveWorkspaceRequests());
        promises.push(Workspace.getActiveWorkspaceFtpUrl());
        $q.all(promises).then(function () {
            activeWorkspaceInfoDeferred.resolve();
        }, function (reason) {
            console.error(reason);
            activeWorkspaceInfoDeferred.reject();
        });
        return activeWorkspaceInfoDeferred.promise;
    }

    this.isActiveWorkspaceInfoLoaded = function () {
        return activeWorkspaceInfoDeferred.promise;
    };

    this.refreshActiveWorkspaceInfo = function () {
        WorkspaceResource.getWorkspaceFromAlias({alias: Workspace.active.workspace.alias, md: true}, function (data) {
            Workspace.active.workspace = data;
            getActiveWorkspaceInfo();
        });
    };

    this.getActiveWorkspaceFtpUrl = function () {
        var deferred = $q.defer();
        WorkspaceResource.getFtpUrl({alias: Workspace.active.workspace.alias}, function (data) {
            Workspace.active.ftp = data;
            deferred.resolve();
        }, function () {
            Workspace.active.ftp = null;
            deferred.reject();
        });
        return deferred.promise;
    };

    this.setActiveWorkspaceFromAlias = function (alias) {
        var deferred = $q.defer();
        if (!this.active.workspace || this.active.workspace.alias !== alias) {
            listDeferred.promise.then(function () {
                var filteredWorkspace = $filter('filter')(Workspace.list, {alias: alias}, true);
                if (filteredWorkspace.length === 0) {
                    Workspace.clearActiveWorkspace();
                    WorkspaceResource.getWorkspaceFromAlias({alias: alias, md: true}, function (data) {
                        Workspace.active.workspace = data;
                        getActiveWorkspaceInfo();
                        deferred.resolve();
                    }, function (error) {
                        console.error('No workspace with alias "%s" or user not authorized to access this workspace', alias);
                        deferred.reject(error);
                    });
                } else {
                    Workspace.active.workspace = filteredWorkspace[0];
                    getActiveWorkspaceInfo();
                    deferred.resolve();
                }
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    };

    this.getActiveWorkspaceMembers = function () {
        var deferred = $q.defer();
        GroupResource.get({key: Workspace.active.workspace.members}, function (data) {
            Workspace.active.members = data.members;
            deferred.resolve();
        }, function () {
            Workspace.active.members = null;
            deferred.reject();
        });
        return deferred.promise;
    };

    this.getActiveWorkspaceMetadata = function () {
        var deferred = $q.defer();
        getWorkspaceMetadata(Workspace.active.workspace).then(function () {
            Workspace.active.metadata = Workspace.metadatas[Workspace.active.workspace.alias];
            deferred.resolve();
        }, function () {
            Workspace.active.metadata = null;
            deferred.reject();
        });
        return deferred.promise;
    };

    this.refreshActiveWorkspaceMetadata = function () {
        var deferred = $q.defer();
        WorkspaceElementResource.get({wskey: Workspace.active.workspace.key, root: 'head', path: '/', metadata: 'ortolang-item-json'}, function (welement) {
            Workspace.active.workspace.metadatas['ortolang-item-json'] = welement.key;
            deferred.resolve(welement.key);
        }, function () {
            deferred.resolve(null);
        });
        return deferred.promise;
    };

    this.getActiveWorkspaceEvents = function () {
        var deferred = $q.defer();
        WorkspaceResource.listEvents({wskey: Workspace.active.workspace.key}, function (data) {
            angular.forEach(data.entries, function (event) {
                getCard(event.throwedBy);
            });
            Workspace.active.events = data.entries;
            deferred.resolve();
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    };

    this.getActiveWorkspaceRequests = function () {
        var deferred = $q.defer();
        RuntimeResource.listProcesses({wskey: Workspace.active.workspace.key}, function (data) {
            Workspace.active.requests = $filter('filter')(data.entries, {'type': 'publish-workspace'}, true);
            angular.forEach(Workspace.active.requests, function (request) {
                getCard(request.initier);
            });
            deferred.resolve();
        }, function () {
            Workspace.active.requests = null;
            deferred.reject();
        });
        return deferred.promise;
    };

    this.getActiveWorkspaceHead = function () {
        var deferred = $q.defer();
        ObjectResource.get({key: Workspace.active.workspace.head}, function (data) {
            Workspace.active.head = data.object;
            Workspace.active.history = {};
            var correspondingSnapshot, correspondingTag;
            angular.forEach(data.history, function (rootCollection) {
                correspondingSnapshot = $filter('filter')(Workspace.active.workspace.snapshots, {key: rootCollection.key}, true)[0];
                if (correspondingSnapshot) {
                    Workspace.active.history[correspondingSnapshot.name] = rootCollection;
                    correspondingTag = $filter('filter')(Workspace.active.workspace.tags, {snapshot: correspondingSnapshot.name}, true)[0];
                    if (correspondingTag) {
                        Workspace.active.history[correspondingSnapshot.name].tag = correspondingTag;
                    }
                }
            });
            deferred.resolve();
        }, function () {
            Workspace.active.head = null;
            Workspace.active.history = null;
            deferred.reject();
        });
        return deferred.promise;
    };

    var refreshActions = {
        events: Workspace.getActiveWorkspaceEvents,
        head: Workspace.getActiveWorkspaceHead
    };

    this.refreshActiveWorkspace = function (infos) {
        angular.forEach(infos, function (info) {
            if (Workspace.refresh[info]) {
                Workspace.refresh[info] = false;
                refreshActions[info]();
            }
        });
    };

    this.refreshWorkspaceList = function () {
        Workspace.getWorkspaceList().then(function () {
            Workspace.getWorkspacesMetadata();
        });
    };

    this.deleted = undefined;

    // *********************** //
    //         Events          //
    // *********************** //

    function needInfoRefresh(eventMessage) {
        return Workspace.active.workspace && (Workspace.active.workspace.key === eventMessage.fromObject || Workspace.refresh.events);
    }

    function checkWorkspaceList(members) {
        listDeferred.promise.then(function () {
            var workspaces = $filter('filter')(Workspace.list, {members: members}, true);
            if (workspaces.length !== 1) {
                SubscriptionResource.refreshWorkspacesFilters();
                Workspace.refreshWorkspaceList();
            }
        });
    }

    this.handleWorkspaceCreation = function (newWorkspace) {
        checkWorkspaceList(newWorkspace.members);
    };

    /**
     * Fired when a new workspace is created or when the connected user is added to the members of a workspace
     * or when a member is added to one of the connected user workspaces
     */
    $rootScope.$on('membership.group.add-member', function (event, eventMessage) {
        event.stopPropagation();
        if (eventMessage.arguments.member === User.key) {
            // Connected user has just been added to this workspace; refreshing workspace list
            checkWorkspaceList(eventMessage.fromObject);
        } else {
            // A member has been added to the active workspace; refreshing active workspace members
            if (Workspace.active.workspace && Workspace.active.workspace.members === eventMessage.fromObject) {
                Workspace.getActiveWorkspaceMembers();
            }
        }
    });

    $rootScope.$on('membership.group.remove-member', function (event, eventMessage) {
        event.stopPropagation();
        listDeferred.promise.then(function () {
            var workspaces = $filter('filter')(Workspace.list, {members: eventMessage.fromObject}, true);
            if (User.key === eventMessage.arguments.member) {
                if (Workspace.active.workspace && Workspace.active.workspace.key === workspaces[0].key) {
                    $location.url('/workspaces');
                } else {
                    Workspace.getWorkspaceList().then(function () {
                        Workspace.getWorkspacesMetadata();
                    });
                }
            } else {
                if (Workspace.active.workspace && Workspace.active.workspace.key === workspaces[0].key) {
                    // A member has been removed from the active workspace; refreshing active workspace members
                    Workspace.getActiveWorkspaceMembers();
                }
            }
        });
    });

    $rootScope.$on('core.workspace.delete', function (event, eventMessage) {
        event.stopPropagation();
        listDeferred.promise.then(function () {
            var workspaces = $filter('filter')(Workspace.list, {key: eventMessage.fromObject}, true);
            if (workspaces.length === 1) {
                Workspace.getWorkspaceList().then(function () {
                    Workspace.deleted = undefined;
                    if (Workspace.list.length > 0) {
                        if (Workspace.active.workspace && Workspace.active.workspace.key === eventMessage.fromObject) {
                            Workspace.active.workspace = null;
                        }
                    } else {
                        Workspace.active.workspace = null;
                    }
                });
            }
        });
    });

    function refreshActiveWorkspaceInfo(eventMessage) {
        listDeferred.promise.then(function () {
            if (Workspace.active.workspace && Workspace.active.workspace.key === eventMessage.fromObject) {
                Workspace.refreshActiveWorkspaceInfo();
            }
        });
    }

    $rootScope.$on('core.workspace.snapshot', function (event, eventMessage) {
        event.stopPropagation();
        refreshActiveWorkspaceInfo(eventMessage);
    });

    $rootScope.$on('core.workspace.tag', function (event, eventMessage) {
        event.stopPropagation();
        refreshActiveWorkspaceInfo(eventMessage);
    });

    $rootScope.$on('core.workspace.lock', function (event, eventMessage) {
        event.stopPropagation();
        refreshActiveWorkspaceInfo(eventMessage);
    });

    // OBJECT
    $rootScope.$on('core.object.create', function ($event, eventMessage) {
        Workspace.refresh.events = needInfoRefresh(eventMessage);
        Workspace.refresh.head = Workspace.refresh.events;
    });
    $rootScope.$on('core.object.update', function ($event, eventMessage) {
        Workspace.refresh.events = needInfoRefresh(eventMessage);
        Workspace.refresh.head = Workspace.refresh.events;
    });
    $rootScope.$on('core.object.delete', function ($event, eventMessage) {
        Workspace.refresh.events = needInfoRefresh(eventMessage);
        Workspace.refresh.head = Workspace.refresh.events;
    });
    $rootScope.$on('core.object.move', function ($event, eventMessage) {
        Workspace.refresh.events = needInfoRefresh(eventMessage);
        Workspace.refresh.head = Workspace.refresh.events;
    });
    // COLLECTION
    $rootScope.$on('core.collection.create', function ($event, eventMessage) {
        Workspace.refresh.events = needInfoRefresh(eventMessage);
        Workspace.refresh.head = Workspace.refresh.events;
    });
    $rootScope.$on('core.collection.update', function ($event, eventMessage) {
        Workspace.refresh.events = needInfoRefresh(eventMessage);
        Workspace.refresh.head = Workspace.refresh.events;
    });
    $rootScope.$on('core.collection.delete', function ($event, eventMessage) {
        Workspace.refresh.events = needInfoRefresh(eventMessage);
        Workspace.refresh.head = Workspace.refresh.events;
    });
    $rootScope.$on('core.collection.move', function ($event, eventMessage) {
        Workspace.refresh.events = needInfoRefresh(eventMessage);
        Workspace.refresh.head = Workspace.refresh.events;
    });
    // METADATA
    $rootScope.$on('core.metadata.create', function ($event, eventMessage) {
        Workspace.refresh.events = needInfoRefresh(eventMessage);
        Workspace.refresh.head = Workspace.refresh.events;
    });
    $rootScope.$on('core.metadata.update', function ($event, eventMessage) {
        Workspace.refresh.events = needInfoRefresh(eventMessage);
        Workspace.refresh.head = Workspace.refresh.events;
    });
    $rootScope.$on('core.metadata.delete', function ($event, eventMessage) {
        Workspace.refresh.events = needInfoRefresh(eventMessage);
        Workspace.refresh.head = Workspace.refresh.events;
    });

    return this;

}]);
