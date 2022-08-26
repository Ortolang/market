'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Cart
 * @description
 * # Cart
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Cart', ['$filter', '$alert', '$translate', 'Settings', 'Content', 'Profile', 'User', 'ortolangType', function ($filter, $alert, $translate, Settings, Content, Profile, User, ortolangType) {

        var content = {};

        function store() {
            if (User.isAuthenticated()) {
                var profileData = {
                    name: 'cart',
                    value: angular.toJson(content),
                    type: 'STRING',
                    visibility: Profile.getVisibilityOptions().NOBODY
                };
                Profile.updateUserProfileData(profileData);
            } else {
                Settings.cart = content;
                Settings.store();
            }
        }

        this.add = function (items) {
            angular.forEach(items, function (item) {
                if (!content[item.wsalias]) {
                    content[item.wsalias] = {};
                }
                if (!content[item.wsalias][item.root]) {
                    content[item.wsalias][item.root] = [];
                }
                if (item.type === ortolangType.collection) {
                    // Remove cart element(s) included in the added folder
                    var delta = content[item.wsalias][item.root].length;
                    content[item.wsalias][item.root] = $filter('filter')(content[item.wsalias][item.root], {path: '!' + item.path}, function (actual, expected) {
                        return actual.indexOf(expected) === 0 && !angular.equals(actual, expected);
                    });
                    delta -= content[item.wsalias][item.root].length;
                    if (delta > 0) {
                        $alert({
                            placement: 'top-right',
                            content: $translate.instant('BROWSER.CART.' + (delta > 1 ? 'REMOVED_ELEMENTS_ALERT' : 'REMOVED_ELEMENT_ALERT'), {delta: delta, collection: item.name}),
                            type: 'success',
                            duration: 7
                        });
                    }
                }
                if ($filter('filter')(content[item.wsalias][item.root], {path: item.path}, true).length === 0) {
                    var collections = $filter('filter')(content[item.wsalias][item.root], {type: ortolangType.collection}, true),
                        alreadyIncluded = false;
                    angular.forEach(collections, function (collection) {
                        if (item.path.indexOf(collection.path) === 0) {
                            alreadyIncluded = true;
                            $alert({
                                placement: 'top-right',
                                content: $translate.instant('BROWSER.CART.ALREADY_INCLUDED_ALERT', {name: item.name, type: item.type, collection: collection.path}),
                                type: 'danger',
                                duration: 5
                            });
                        }
                    });
                    if (!alreadyIncluded) {
                        content[item.wsalias][item.root].push(item);
                    }
                } else {
                    $alert({
                        placement: 'top-right',
                        content: $translate.instant('BROWSER.CART.ALREADY_SELECTED_ALERT', item),
                        type: 'danger',
                        duration: 5
                    });
                }
            });
            store();
        };

        this.size = function () {
            var size = 0;
            angular.forEach(content, function (workspace) {
                angular.forEach(workspace, function (version) {
                    size += version.length;
                });
            });
            return size;
        };

        this.getContent = function () {
            return content;
        };

        this.clear = function () {
            content = {};
            store();
        };

        this.remove = function (wsalias, root, $index) {
            content[wsalias][root].splice($index, 1);
            if (content[wsalias][root].length === 0) {
                delete content[wsalias][root];
            }
            if (Object.keys(content[wsalias]).length === 0) {
                delete content[wsalias];
            }
            store();
        };

        this.export = function () {
            var paths = [];
            angular.forEach(content, function (workspace) {
                angular.forEach(workspace, function (version) {
                    angular.forEach(version, function (element) {
                        paths.push(element.wsalias + '/' + element.root + element.path);
                    });
                });
            });
            Content.export(paths);
        };

        Settings.initialized().then(function () {
            if (User.isAuthenticated()) {
                User.sessionInitialized().then(function () {
                    var profileCart = {};
                    if (User.getProfileData('cart')) {
                        profileCart = angular.fromJson(User.getProfileData('cart').value);
                    }
                    if (Object.keys(Settings.cart).length > 0) {
                        angular.merge(content, profileCart, Settings.cart);
                        store();
                        Settings.cart = {};
                        Settings.store();
                    } else {
                        content = profileCart;
                    }
                });
            } else {
                content = Settings.cart;
            }
        });

        return this;
    }]);
