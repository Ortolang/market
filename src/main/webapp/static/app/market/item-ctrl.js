'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ItemCtrl
 * @description
 * # ItemCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ItemCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$route', '$filter', '$sanitize', 'Content', 'SearchResource', 'MarketBrowserService', 'Helper', function ($rootScope, $scope, $routeParams, $location, $route, $filter, $sanitize, Content, SearchResource, MarketBrowserService, Helper) {

        function loadItem() {
            SearchResource.findWorkspace({alias: $scope.itemAlias}, function (workspace) {
                workspace =  workspace['meta_ortolang-workspace-json'];
                $scope.tags = $filter('orderBy')(workspace.tags, function (tag) {
                    return tag.name;
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

                MarketBrowserService.workspace = {alias: $scope.itemAlias, key: workspace.wskey, tags: workspace.tags};

                SearchResource.findCollection({key: $scope.tag.key}, function (collection) {
                    $scope.ortolangObject = collection;
                    $scope.root = $scope.tag.snapshot;
                    $scope.itemKey = collection.key;
                    $scope.item = collection['meta_ortolang-item-json'];

                    if (!/^(corpora|lexicons|applications|tools)$/.test($routeParams.section)) {
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
                        }
                        $location.replace();
                    } else {
                        generateMicroData();
                        $scope.ready = true;
                    }
                });
            });
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
                microData.image = Content.getPreviewUrlWithPath(jsonMetadata.image, $scope.itemAlias, $scope.tag.snapshot);
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
                    if (contributorWrapper && contributorWrapper.entity && contributorWrapper.entity['meta_ortolang-referential-json']) {
                        var contributor = contributorWrapper.entity['meta_ortolang-referential-json'],
                            contributorMicroData = {};
                        contributorMicroData['@type'] = 'Person';
                        contributorMicroData.name = contributor.fullname;
                        contributorMicroData.worksFor = generateProducerMicroData(contributorWrapper.organization);
                        contributors.push(contributorMicroData);
                    }
                });
                microData.contributor = contributors.length === 1 ? contributors[0] : contributors;
            }
            // **************
            microDataElement = angular.element('<script type="application/ld+json">');
            microDataElement.text(angular.toJson(microData));
            angular.element('head').append(microDataElement);
            //console.log(jsonMetadata);
            //console.log(microData);
        }

        function generateProducerMicroData(producerWrapper) {
            if (producerWrapper && producerWrapper['meta_ortolang-referential-json']) {
                var producer = producerWrapper['meta_ortolang-referential-json'],
                    microDataProducer = {};
                microDataProducer['@type'] = 'Organization';
                microDataProducer.name = producer.name;
                microDataProducer.url = producer.homepage;
                microDataProducer.logo = producer.img;
                microDataProducer.alternateName = producer.acronym;
                if (producer.country) {
                    microDataProducer.address = {
                        '@type': 'PostalAddress',
                        'addressCountry': producer.country
                    };
                    if (producer.city) {
                        microDataProducer.address.addressLocality = producer.city;
                    }
                }
                return microDataProducer;
            }
        }

        function init() {
            $scope.itemAlias = $routeParams.alias;
            $scope.browse = $location.search().browse;
            $scope.ready = false;
            $scope.item = {};
            loadItem();
        }

        init();

    }]);
