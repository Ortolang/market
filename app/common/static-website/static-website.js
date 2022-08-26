'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.StaticWebsite
 * @description
 * # StaticWebsite
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('StaticWebsite', ['url', 'Settings', '$rootScope', 'Content',
        function (url, Settings, $rootScope, Content) {

            var staticWebsiteAlias = 'static-website',
                informationId = 'information',
                newsId = 'news',
                homePageId = 'home',
                homePage, // Url of the HTML content on the home page
                informationContent, // Menu Information
                news, // List of news url to display
                informationPages = {}, // static pages HTML content
                staticWebsiteBase = url.content + '/' + staticWebsiteAlias + '/' + OrtolangConfig.staticSiteVersion;

            this.getInformationContent = function () {
                return informationContent;
            };

            this.getInformationPageTitle = function (page) {
                return page.title[(Settings.language || 'fr')] || page.title;
            };

            this.getInformationPage = function (id) {
                return informationPages[id];
            };

            this.getNews = function () {
                return news;
            };

            this.getHomePage = function () {
                return homePage;
            };

            this.getStaticWebsiteBase = function () {
                return staticWebsiteBase;
            };

            function populateInformationPage(language) {
                Content.downloadWithPath(informationId + '/' + informationId + '.json', staticWebsiteAlias, OrtolangConfig.staticSiteVersion, 'default').promise.then(function (response) {
                    informationContent = response.data.content;
                    angular.forEach(response.data.content, function (page) {
                        informationPages[page.id] = staticWebsiteBase + '/' + informationId + '/' + page.id + '/' + page.id + '.' + (language || 'fr') + '.html';
                    });
                    $rootScope.$emit('informationPagePopulated');
                });
            }

            function populateHomePage(language) {
                homePage = staticWebsiteBase + '/' + homePageId + '/' + homePageId + '.' + (language || 'fr') + '.html';
                Content.downloadWithPath(newsId + '/' + newsId + '.json', staticWebsiteAlias, OrtolangConfig.staticSiteVersion, 'default').promise.then(function (response) {
                    news = [];
                    angular.forEach(response.data.news, function (n) {
                        n.url = staticWebsiteBase + '/' + newsId + '/' + n.id + '/' + n.id + '.' + (language || 'fr') + '.html';
                        news.push(n);
                    });
                });
            }

            $rootScope.$on('languageInitialized', function ($event, language) {
                populateHomePage(language);
                populateInformationPage(language);
            });

            $rootScope.$on('$translateChangeSuccess', function ($event, language) {
                populateHomePage(language.language);
                populateInformationPage(language.language);
            });

            return this;

        }]);
