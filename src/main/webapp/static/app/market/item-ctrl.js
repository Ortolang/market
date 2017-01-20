'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ItemCtrl
 * @description
 * # ItemCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ItemCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$route', '$filter', '$sanitize', 'Content', 'SearchResource', 'Helper', 'url', function ($rootScope, $scope, $routeParams, $location, $route, $filter, $sanitize, Content, SearchResource, Helper, url) {

        var handle;

        function generateProducerMicroData(producerWrapper) {
            if (producerWrapper) {
                var microDataProducer = {};
                microDataProducer['@type'] = 'Organization';
                microDataProducer.name = producerWrapper.name;
                microDataProducer.url = producerWrapper.homepage;
                microDataProducer.logo = producerWrapper.img;
                microDataProducer.alternateName = producerWrapper.acronym;
                if (producerWrapper.country) {
                    microDataProducer.address = {
                        '@type': 'PostalAddress',
                        'addressCountry': producerWrapper.country
                    };
                    if (producerWrapper.city) {
                        microDataProducer.address.addressLocality = producerWrapper.city;
                    }
                }
                return microDataProducer;
            }
        }

        function generateMicroData() {
            var microDataElement,
                microData = {},
                jsonMetadata = $scope.item;
            microData['@context'] = 'http://schema.org';
            microData['@type'] = 'DataSet';
            microData.mainEntityOfPage = {
                '@type': 'WebPage',
                '@id': location.href
            };
            microData.name = Helper.getMultilingualValue(jsonMetadata.title, 'fr');
            // Description
            var sanitizedDescription = $sanitize(Helper.getMultilingualValue(jsonMetadata.description, 'fr'));
            sanitizedDescription = angular.element('<div>').html(sanitizedDescription).text().substring(0, 200);
            sanitizedDescription = sanitizedDescription.substring(0, sanitizedDescription.lastIndexOf(' '));
            microData.description = sanitizedDescription;
            $rootScope.ortolangPageDescription = sanitizedDescription;
            // **************
            // Image
            if (jsonMetadata.image) {
                microData.image = Content.getThumbUrlWithPath(jsonMetadata.image, $scope.itemAlias, $scope.tag.snapshot);
            }
            // **************
            microData.datePublished = jsonMetadata.publicationDate;
            microData.version = $scope.tag.name.substring(1);
            // Keywords
            var keywordsString = '';
            angular.forEach(jsonMetadata.keywords, function (keyword, index) {
                keywordsString += (index === 0 ? '' : ', ') + keyword.value;
            });
            microData.keywords = keywordsString;
            // **************
            // Producers
            if (jsonMetadata.producers && jsonMetadata.producers.length > 0) {
                var producers = [];
                angular.forEach(jsonMetadata.producers, function (producerWrapper) {
                    producers.push(generateProducerMicroData(producerWrapper));
                });
                microData.producer = producers.length === 1 ? producers[0] : producers;
            }
            // **************
            // Contributors
            if (jsonMetadata.producers && jsonMetadata.producers.length > 0) {
                var contributors = [];
                angular.forEach(jsonMetadata.contributors, function (contributorWrapper) {
                    if (contributorWrapper && contributorWrapper.entity) {
                        var contributorMicroData = {};
                        contributorMicroData['@type'] = 'Person';
                        contributorMicroData.name = contributorWrapper.entity.fullname;
                        contributorMicroData.worksFor = generateProducerMicroData(contributorWrapper.organization);
                        contributors.push(contributorMicroData);
                    }
                });
                microData.contributor = contributors.length === 1 ? contributors[0] : contributors;
            }
            // **************
            microDataElement = angular.element('<script class="microdata" type="application/ld+json">');
            microDataElement.text(angular.toJson(microData));
            angular.element('script.microdata').remove();
            angular.element('head').append(microDataElement);

            return microData;
        }

        function generateOpenGraphTags(microdata) {
            angular.element('meta[property^="og"]').remove();
            angular.element('<meta property="og:url" content="' + handle + '">').appendTo('head');
            angular.element('<meta property="og:title" content="' + microdata.name + ' | ORTOLANG">').appendTo('head');
            angular.element('<meta property="og:site_name" content="ORTOLANG">').appendTo('head');
            angular.element('<meta property="og:description" content="' + microdata.description + '">').appendTo('head');
            if (microdata.image) {
                angular.element('<meta property="og:image" content="' + microdata.image + '">').appendTo('head');
            }
        }

        function generateSocialLinks(microdata) {
            $scope.item.social = {};
            // Facebook
            $scope.item.social.facebook = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(handle);
            // Twitter
            $scope.item.social.twitter = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(handle);
            $scope.item.social.twitter += '&text=' + encodeURIComponent(microdata.name);
            // Google Plus
            //$scope.item.social.google = 'https://plus.google.com/share?url=' + encodeURIComponent(handle);
            // Viadeo
            $scope.item.social.viadeo = 'https://partners.viadeo.com/share?url=' + encodeURIComponent(handle);
            // LinkedIn
            $scope.item.social.linkedin = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent(handle);
            $scope.item.social.linkedin += '&mini=true';
            $scope.item.social.linkedin += '&title=' + encodeURIComponent(microdata.name);
            $scope.item.social.linkedin += '&summary=' + encodeURIComponent(microdata.description);
            $scope.item.social.linkedin += '&source=ORTOLANG';
        }

        function loadItem() {
            SearchResource.getWorkspace({alias: $scope.itemAlias}, function (workspace) {
                $scope.tags = $filter('orderBy')(workspace.snapshots, function (snapshot) {
                    return snapshot.tag;
                });

                if ($routeParams.version) {
                    var filteredTag = $filter('filter')($scope.tags, {name: $routeParams.version}, true);
                    if (filteredTag.length === 1) {
                        $scope.tag = filteredTag[0];
                    }
                }
                if (!$scope.tag) {
                    $scope.tag = $scope.tags[$scope.tags.length - 1];
                }
                // For browser directive
                $scope.workspace = {alias: $scope.itemAlias, key: workspace.key, tags: workspace.tags};
                
                // SearchResource.findCollection({key: $scope.tag.key}, function (collection) {
                SearchResource.getItem({type: $routeParams.section, id: $scope.itemAlias, version: $scope.tag.tag}, function (collection) {
                    $scope.ortolangObject = collection;
                    $scope.root = $scope.tag.name;
                    $scope.item = collection;
                    $scope.itemKey = collection.key;
                    $scope.wskey = workspace.key;

                    if (!/^(corpora|lexicons|applications|tools|terminologies)$/.test($routeParams.section)) {
                        switch ($scope.item.type) {
                            case 'Corpus':
                                $route.updateParams({section: 'corpora'});
                                break;
                            case 'Lexique':
                                $route.updateParams({section: 'lexicons'});
                                break;
                            case 'Application':
                                $route.updateParams({section: 'applications'});
                                break;
                            case 'Outil':
                                $route.updateParams({section: 'tools'});
                                break;
                            case 'Terminologie':
                                $route.updateParams({section: 'terminologies'});
                                break;
                        }
                        $location.replace();
                    } else {
                        var microdata = generateMicroData();
                        generateOpenGraphTags(microdata);
                        generateSocialLinks(microdata);
                        $scope.ready = true;
                    }
                });
            }, function () {
                $scope.ready = true;
            });
        }

        $scope.$on('$routeChangeSuccess', function ($event, current, previous) {
            if (previous) {
                // if previous route was /market/(corpora|lexicons...) and params
                $scope.fromSearch = Object.keys(previous.params).length > 0 && /^\/market\/\w+$/.test(previous.$$route.originalPath);
            }
        });

        (function init() {
            $scope.itemAlias = $routeParams.alias;
            $scope.browse = $location.search().browse;
            $scope.ready = false;
            $scope.item = {};
            handle = 'https://hdl.handle.net/' + url.handlePrefix + '/' + $scope.itemAlias + ($scope.tag ? '/' + $scope.tag.name : '');
            loadItem();
        }());

    }]);
