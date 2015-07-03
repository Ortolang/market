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
                infoMenuId = 'information',
                newsId = 'news',
                homepageId = 'home';

            this.wskey = undefined; // key of Static Website workspace
            this.version = undefined; //Latest version of Static Website
            this.informationMenu = undefined; // Menu Information
            this.news = []; // List of news id to display
            this.homepage = undefined; // presentation on homepage HTML content
            this.pages = []; // static pages HTML content

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

            this.getNews = function () {
                return this.news;
            };

            this.getHomePage = function () {
                return this.homepage;
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

            this.getWskey = function () {
                var that = this;
                return WorkspaceResource.getKey({alias: aliasSite}, function (data) {
                    that.wskey = data.key;
                });
            };

            this.getLatestVersion = function (wskey) {
                var that = this;
                return WorkspaceResource.query({wskey: wskey}, function(ws) {
                    that.version = ws.snapshots.length;
                });
            };

            // *********************** //
            //           Init          //
            // *********************** //

            function populateStaticMenu (that) {
                console.log('Initialize static website menu');
                var staticMenu;
                that.getWskey().$promise.then(function(key){
                    var wskey = key.key;

                    that.getLatestVersion(wskey).$promise.then(function(ws) {
                        var version = ws.snapshots.length;

                        console.debug('Static site wskey : ', wskey);
                        WorkspaceElementResource.get({wskey: wskey, path: '/' + infoMenuId}, function (info) {
                            // Retrieve Information menu
                            var keyMenu = $filter('filter')(info.elements, {name: infoMenuId + '.' + Settings.language + '.json'}, true)[0];
                            if (keyMenu === null) {
                                keyMenu = $filter('filter')(info.elements, {name: infoMenuId + '.json'}, true)[0];
                            }
                            $resource(url.content + '/' + aliasSite + '/' + version + '/' + infoMenuId + '/' + keyMenu.name).get({}, function (menuContent) {
                                menuContent.id = infoMenuId;
                                staticMenu = menuContent;

                                angular.forEach(menuContent.content, function (subItem) {
                                    WorkspaceElementResource.get({
                                        wskey: wskey,
                                        path: '/' + infoMenuId + '/' + subItem
                                    }, function (subInfo) {
                                        var keySubMenu = $filter('filter')(subInfo.elements, {name: subInfo.name.toLowerCase() + '.' + Settings.language + '.json'}, true)[0];
                                        if (keySubMenu === null) {
                                            keySubMenu = $filter('filter')(subInfo.elements, {name: subInfo.name.toLowerCase() + '.json'}, true)[0];
                                        }
                                        $resource(url.content + '/' + aliasSite + '/' + version + '/' + infoMenuId + '/' + subItem + '/' + keySubMenu.name).get({}, function (subMenuContent) {
                                            staticMenu[subItem] = subMenuContent;
                                        });
                                    });

                                });

                                that.setInformationMenu(staticMenu);
                                $rootScope.$broadcast('static-site-initialized');
                                console.log('static website menu initialized');

                                // Retrieve Information pages content
                                angular.forEach(menuContent.content, function (id) {
                                    setStaticPage(that, id, infoMenuId + '/' + id);
                                });
                                console.log('static website pages initialized');
                            });
                        });
                    });
                });
            }

            function populateHomePage (that) {
                console.log('Initialize homepage and news');

                that.getWskey().$promise.then(function(key) {
                    var wskey = key.key;

                    that.getLatestVersion(wskey).$promise.then(function(ws) {
                        var version = ws.snapshots.length;

                        WorkspaceElementResource.get({wskey: wskey, path: '/' + newsId}, function (home) {
                            // Retrieve presentation on homepage
                            var keyHomePage = $filter('filter')(home.elements, {name: homepageId + '.' + Settings.language + '.html'}, true)[0];
                            if (keyHomePage === null) {
                                keyHomePage = $filter('filter')(home.elements, {name: homepageId + '.html'}, true)[0];
                            }
                            that.getHTMLContent(url.content + '/' + aliasSite + '/' + version + '/' + newsId + '/' + keyHomePage.name).get().$promise.then(function (result) {
                                that.homepage = updateRelativeLink(result.content, version);
                            });

                            // Retrieve news
                            var keyNews = $filter('filter')(home.elements, {name: newsId + '.json'}, true)[0];
                            $resource(url.content + '/' + aliasSite + '/' + version + '/' + newsId + '/' + keyNews.name).get({}, function (newsContent) {
                                that.news = newsContent.news;
                                angular.forEach(newsContent.news, function (idNews) {
                                    setStaticPage(that, idNews, newsId + '/' + idNews);
                                });
                            });
                        });
                    });
                });

                console.log('static homepage and news initialized');
            }

            function setStaticPage(that, id, path){
                WorkspaceElementResource.get({wskey: that.wskey, path: '/' + path}, function (data) {
                    var pageName = $filter('filter')(data.elements, {name: data.name.toLowerCase() + '.' + Settings.language + '.html'}, true)[0];
                    if (pageName === null) {
                        pageName = $filter('filter')(data.elements, {name: data.name.toLowerCase() + '.html'}, true)[0];
                    }
                    that.getHTMLContent(url.content + '/' + aliasSite + '/' + that.version + '/' + path + '/' + pageName.name).get().$promise.then(function (result) {
                        that.pages[id] =  updateRelativeLink(result.content, that.version);
                    });
                });
            }

            function updateRelativeLink(text, version) {
                if(text !== '') {
                    var pattern = /\{URL\}/g;
                    var replacement = url.content + '/' + aliasSite + '/' + version;

                    return text.replace(pattern, replacement);
                }
                return text;
            }


            this.init = function () {
                populateStaticMenu(this);
                populateHomePage(this);
            };

            this.init();

            return this;

        }]);
