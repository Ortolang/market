'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.StaticWebsite
 * @description
 * # StaticWebsite
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('StaticWebsite', ['WorkspaceResource', 'WorkspaceElementResource', '$resource', 'url', '$filter', 'Settings', '$rootScope', '$http', 'Content',
        function (WorkspaceResource, WorkspaceElementResource,$resource, url, $filter, Settings, $rootScope, $http, Content) {

            var aliasSite = 'staticsite',
                infoMenuId = 'information',
                newsId = 'news',
                homepageId = 'home';

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


            // *********************** //
            //           Init          //
            // *********************** //

            function populateStaticMenu (that) {
                console.log('Initialize static website menu');
                var staticMenu;
                var urlInfo = Content.getContentUrlWithPath(infoMenuId, aliasSite, 'latest');
                that.getHTMLContent(urlInfo).get({}, function (res) {
                    var filename;
                    if (res.content.indexOf(infoMenuId + '.' + Settings.language + '.json') !== -1) {
                        filename = infoMenuId + '.' + Settings.language + '.json';
                    } else if (res.content.indexOf(infoMenuId + '.json') !== -1) {
                        filename = infoMenuId + '.json';
                    }
                    var urlInfoMenu = Content.getContentUrlWithPath(infoMenuId + '/' + filename, aliasSite, 'latest');
                    $resource(urlInfoMenu).get({}, function (menuContent) {
                        menuContent.id = infoMenuId;
                        staticMenu = menuContent;

                        angular.forEach(menuContent.content, function (subItem) {
                            var urlInfoContent = Content.getContentUrlWithPath(infoMenuId + '/' + subItem, aliasSite, 'latest');
                            that.getHTMLContent(urlInfoContent).get({}, function (res) {
                                var subMenuFilename;
                                if (res.content.indexOf(subItem.toLowerCase() + '.' + Settings.language + '.json') !== -1) {
                                    subMenuFilename = subItem.toLowerCase() + '.' + Settings.language + '.json';
                                } else if (res.content.indexOf(subItem.toLowerCase() + '.json') !== -1) {
                                    subMenuFilename = subItem.toLowerCase() + '.json';
                                }
                                var urlInfoSubMenu = Content.getContentUrlWithPath(infoMenuId + '/' + subItem + '/' + subMenuFilename, aliasSite, 'latest');
                                $resource(urlInfoSubMenu).get({}, function (subMenuContent) {
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
            }

            function populateHomePage (that) {
                console.log('Initialize homepage and news');
                var urlNews = Content.getContentUrlWithPath(newsId, aliasSite, 'latest');
                that.getHTMLContent(urlNews).get({}, function (res) {
                    // retrieve homepage
                    var filename;
                    if (res.content.indexOf(homepageId + '.' + Settings.language + '.html') !== -1) {
                        filename = homepageId + '.' + Settings.language + '.html';
                    } else if (res.content.indexOf(homepageId + '.html') !== -1) {
                        filename = homepageId + '.html';
                    }
                    var urlHomePage = Content.getContentUrlWithPath(newsId + '/' + filename, aliasSite, 'latest');
                    that.getHTMLContent(urlHomePage).get().$promise.then(function (result) {
                        that.homepage = updateRelativeLink(result.content);
                    });
                    // Retrieve news
                    var newsFileName;
                    if (res.content.indexOf(newsId + '.json') !== -1) {
                        newsFileName = newsId + '.json';
                    }
                    var urlNews = Content.getContentUrlWithPath(newsId + '/' + newsFileName, aliasSite, 'latest');
                    $resource(urlNews).get({}, function (result) {
                        that.news = result.news;
                        angular.forEach(result.news, function (idNews) {
                            setStaticPage(that, idNews, newsId + '/' + idNews);
                        });
                    });
                });
            }

            function setStaticPage(that, id, path){
                var urlNews = Content.getContentUrlWithPath(path, aliasSite, 'latest');
                that.getHTMLContent(urlNews).get().$promise.then(function (res) {
                    var pageName;
                    if (res.content.indexOf(id + '.' + Settings.language + '.html') !== -1) {
                        pageName = id + '.' + Settings.language + '.html';
                    } else if (res.content.indexOf(id + '.html') !== -1) {
                        pageName = id + '.html';
                    }
                    var urlNewsPage = Content.getContentUrlWithPath(path + '/' + pageName, aliasSite, 'latest');
                    that.getHTMLContent(urlNewsPage).get().$promise.then(function (result) {
                        that.pages[id] =  updateRelativeLink(result.content);
                    });
                });
            }

            function updateRelativeLink(text) {
                if(text !== '') {
                    var pattern = /\{URL\}/g;
                    var replacement = url.content + '/' + aliasSite + '/latest' ;

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
