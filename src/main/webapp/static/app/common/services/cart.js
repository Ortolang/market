'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Cart
 * @description
 * # Cart
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('Cart', ['Settings', 'Content', 'Profile', 'User', function (Settings, Content, Profile, User) {

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
                content[item.wsalias][item.root].push(item);
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
                        paths.push(element.path);
                    });
                });
            });
            Content.export(paths);
        };

        User.sessionInitialized().then(function () {
            Settings.initialized().then(function () {
                if (User.isAuthenticated()) {
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
                } else {
                    content = Settings.cart;
                }
            });
        });

        return this;
    }]);
