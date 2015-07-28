'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.StaticWebsite
 * @description
 * # StaticWebsite
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('StaticWebsite', ['$resource', 'url', 'Settings', '$rootScope', '$http', 'Content',
        function ($resource, url, Settings, $rootScope, $http, Content) {

            var aliasSite = 'staticsite',
                infoMenuId = 'information',
                newsId = 'news',
                homepageId = 'home',
                homepage, // presentation on homepage HTML content
                informationMenu, // Menu Information
                news = [], // List of news id to display
                pages = []; // static pages HTML content

            this.getInformationMenu = function () {
                return informationMenu;
            };

            this.getPage = function (id) {
                return pages[id];
            };

            this.getNews = function () {
                return news;
            };

            this.getHomePage = function () {
                return homepage;
            };

            function getHTMLContent(url) {
                return $resource(url, {}, {
                    get: {
                        method: 'GET',
                        transformRequest: [function (data, headersGetter) {
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

            function populateStaticMenu() {
                console.log('Initialize static website menu');
                var staticMenu,
                    urlInfo = Content.getContentUrlWithPath(infoMenuId, aliasSite, 'latest');
                getHTMLContent(urlInfo).get({}, function (res) {
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
                            getHTMLContent(urlInfoContent).get({}, function (res) {
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

                        informationMenu = staticMenu;
                        $rootScope.$broadcast('static-site-initialized');
                        console.log('static website menu initialized');

                        // Retrieve Information pages content
                        angular.forEach(menuContent.content, function (id) {
                            setStaticPage(id, infoMenuId + '/' + id);
                        });
                        console.log('static website pages initialized');
                    });
                });
            }

            function populateHomePage() {
                console.log('Initialize homepage and news');
                var urlNews = Content.getContentUrlWithPath(newsId, aliasSite, 'latest');
                getHTMLContent(urlNews).get({}, function (res) {
                    // retrieve homepage
                    var filename;
                    if (res.content.indexOf(homepageId + '.' + Settings.language + '.html') !== -1) {
                        filename = homepageId + '.' + Settings.language + '.html';
                    } else if (res.content.indexOf(homepageId + '.html') !== -1) {
                        filename = homepageId + '.html';
                    }
                    var urlHomePage = Content.getContentUrlWithPath(newsId + '/' + filename, aliasSite, 'latest');
                    getHTMLContent(urlHomePage).get().$promise.then(function (result) {
                        homepage = updateRelativeLink(result.content);
                    });
                    // Retrieve news
                    var newsFileName;
                    if (res.content.indexOf(newsId + '.json') !== -1) {
                        newsFileName = newsId + '.json';
                    }
                    var urlNews = Content.getContentUrlWithPath(newsId + '/' + newsFileName, aliasSite, 'latest');
                    $resource(urlNews).get({}, function (result) {
                        news = result.news;
                        angular.forEach(result.news, function (idNews) {
                            setStaticPage(idNews, newsId + '/' + idNews);
                        });
                    });
                });
            }

            function setStaticPage(id, path) {
                var urlNews = Content.getContentUrlWithPath(path, aliasSite, 'latest');
                getHTMLContent(urlNews).get().$promise.then(function (res) {
                    var pageName;
                    if (res.content.indexOf(id + '.' + Settings.language + '.html') !== -1) {
                        pageName = id + '.' + Settings.language + '.html';
                    } else if (res.content.indexOf(id + '.html') !== -1) {
                        pageName = id + '.html';
                    }
                    var urlNewsPage = Content.getContentUrlWithPath(path + '/' + pageName, aliasSite, 'latest');
                    getHTMLContent(urlNewsPage).get().$promise.then(function (result) {
                        pages[id] =  updateRelativeLink(result.content);
                    });
                });
            }

            function updateRelativeLink(text) {
                if (text !== '') {
                    var pattern = /\{URL\}/g,
                        replacement = url.content + '/' + aliasSite + '/latest';

                    return text.replace(pattern, replacement);
                }
                return text;
            }

            $rootScope.$on('$translateChangeSuccess', function () {
                populateStaticMenu();
                populateHomePage();
            });

            return this;

        }]);
