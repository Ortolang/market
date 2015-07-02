'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.StaticWebsite
 * @description
 * # StaticWebsite
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('StaticWebsite', ['WorkspaceResource', 'WorkspaceElementResource', '$resource', 'url', '$filter', 'Settings', '$rootScope', '$http',
        function (WorkspaceResource, WorkspaceElementResource,$resource, url, $filter, Settings, $rootScope, $http) {

            var aliasSite = 'staticsite',
                infoMenuId = 'information';

            this.informationMenu = undefined;
            this.wskey = undefined;
            this.pages = [];

            // Methods
            this.setInformationMenu = function (value) {
                this.informationMenu = value;
            };

            this.getInformationMenu = function () {
                return this.informationMenu;
            };

            this.getPage = function (id) {
                return this.pages[id];
            };

            this.getHTMLContent = function (url) {
                return $resource(url , {}, {
                    get: {
                        method: 'GET',
                        transformRequest: [function(data, headersGetter){
                        }].concat($http.defaults.transformRequest),
                        transformResponse: [function (data, headersGetter) {
                            return {content: data};
                        }].concat($http.defaults.transformResponse)
                    }
                });
            };


            // *********************** //
            //           Init          //
            // *********************** //

            function populateStaticMenu (that) {
                console.log('Initialize static website menu');
                var staticMenu;
                WorkspaceResource.getKey({alias: aliasSite}, function (data) {
                    that.wskey = data.key;
                    WorkspaceElementResource.get({wskey: data.key, path: '/' + infoMenuId}, function (info) {
                        //console.debug(info);
                        var keyMenu = $filter('filter')(info.elements, {name: infoMenuId + '.' + Settings.language + '.json'}, true)[0];
                        if (keyMenu === null) {
                            keyMenu = $filter('filter')(info.elements, {name: infoMenuId + '.json'}, true)[0];
                        }
                        $resource(url.content + '/' + aliasSite + '/1/' + infoMenuId + '/' + keyMenu.name).get({}, function (menuContent) {
                            menuContent.id = infoMenuId;
                            staticMenu = menuContent;

                            angular.forEach(menuContent.content, function(subItem) {
                                WorkspaceElementResource.get({wskey: data.key, path: '/' + infoMenuId + '/' + subItem}, function (subInfo) {
                                    var keySubMenu = $filter('filter')(subInfo.elements, {name: subInfo.name.toLowerCase() + '.' + Settings.language + '.json'}, true)[0];
                                    if (keySubMenu === null) {
                                        keySubMenu = $filter('filter')(subInfo.elements, {name: subInfo.name.toLowerCase() + '.json'}, true)[0];
                                    }
                                    $resource(url.content + '/' + aliasSite + '/1/' + infoMenuId + '/' + subItem + '/' + keySubMenu.name).get({}, function (subMenuContent) {
                                        staticMenu[subItem] = subMenuContent;
                                    });
                                });

                            });

                            that.setInformationMenu(staticMenu);
                            $rootScope.$broadcast('static-site-initialized');
                            console.log('static website menu initialized');
                            angular.forEach(menuContent.content, function(id) {
                                getStaticPage(that, id);
                            });
                            console.log('static website pages initialized');
                        });
                    });
                });
            }

            function getStaticPage(that, id){
                WorkspaceElementResource.get({wskey: that.wskey, path: '/' + infoMenuId + '/' + id}, function (data) {
                    //console.debug('page', id, data);
                    var pageName = $filter('filter')(data.elements, {name: data.name.toLowerCase() + '.' + Settings.language + '.html'}, true)[0];
                    if (pageName === null) {
                        pageName = $filter('filter')(data.elements, {name: data.name.toLowerCase() + '.html'}, true)[0];
                    }
                    that.getHTMLContent(url.content + '/' + aliasSite + '/1/' + infoMenuId + '/' + id + '/' + pageName.name).get().$promise.then(function (result) {
                        that.pages[id] = updateResourceLink(result);
                    });
                });
            }

            function updateResourceLink(text) {
                var pattern = /(src|href)=\s*"\s*resources/g;
                var replacement = '$1="' + url.content + '/' + aliasSite + '/1/resources';

                if(text !== '') {
                    return text.content.replace(pattern, replacement);
                }
                return text;
            }


            this.init = function () {
                populateStaticMenu(this);
            };

            this.init();

            return this;

        }]);
