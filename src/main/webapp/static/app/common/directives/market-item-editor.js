'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:marketItemEditor
 * @description
 * # marketItemEditor
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('marketItemEditor', ['$rootScope', '$translate', '$http', '$location', '$window', '$modal', '$anchorScroll', '$filter', 'ortolangType', 'icons', 'url', 'WorkspaceElementResource', 'ObjectResource', 'QueryBuilderFactory', 'Settings', 'JsonResultResource', function ($rootScope, $translate, $http, $location, $window, $modal, $anchorScroll, $filter, ortolangType, icons, url, WorkspaceElementResource, ObjectResource, QueryBuilderFactory, Settings, JsonResultResource) {
        return {
            restrict: 'EA',
            templateUrl: 'common/directives/market-item-editor.html',
            scope: {
                metadata: '=',
                workspace: '=',
                root: '=',
                togglePreviewing: '&',
                toggleEditing: '&',
                toggleCreating: '&',
                step: '='
            },
            link: {
                pre: function (scope) {

                    scope.submitForm = function () {
                        console.log('submit form');

                        if (scope.metadataItemform.$invalid) {
                            console.log('not ready');
                            return;
                        }

                        for(var propertyName in scope.metadata) {
                            if(scope.metadata[propertyName].length===0) {
                                delete scope.metadata[propertyName];
                            }
                        }

                        scope.metadata.corporaStyles = [];
                        angular.forEach(scope.corporaStyleTag, function(tag) {
                            scope.metadata.corporaStyles.push(tag.id);
                        });

                        scope.metadata.annotationLevels = [];
                        angular.forEach(scope.selectedAnnotationLevels, function(tag) {
                            scope.metadata.annotationLevels.push(tag.id);
                        });

                        scope.metadata.corporaFormats = [];
                        angular.forEach(scope.selectedCorporaFormats, function(tag) {
                            scope.metadata.corporaFormats.push(tag.id);
                        });

                        var content = angular.toJson(scope.metadata),
                            contentType = 'text/json';

                        sendForm(content, contentType);
                    };


                    function sendForm(content, contentType) {

                        var uploadUrl = url.api + '/workspaces/' + (scope.selectedElements ? scope.selectedElements[0].workspace : scope.workspace.key) + '/elements/',
                            fd = new FormData(),
                            currentPath = scope.selectedElements ? scope.selectedElements[0].path : '/';

                        fd.append('path', currentPath);
                        fd.append('type', ortolangType.metadata);

                        // fd.append('format', scope.userMetadataFormat.key);
                        fd.append('name', 'ortolang-item-json');

                        var blob = new Blob([content], { type: contentType});

                        fd.append('stream', blob);

                        $http.post(uploadUrl, fd, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        })
                        .success(function () {

                            console.log('submit form success');
                            // scope.hideEditor();
                            // resetMetadataFormat();
                            // scope.refreshSelectedElement();
                            if(scope.step) {
                                scope.toggleCreating();
                                scope.togglePreviewing();
                            } else {
                                scope.toggleEditing();
                            }

                        })
                        .error(function (error) {
                            console.error('creation of metadata failed !', error);
                            // scope.hideEditor();
                            // resetMetadataFormat();
                        });
                    }

                    scope.selectType = function () {
                        scope.metadata.type = scope.selectedType.key;
                    };

                    scope.selectStatusOfUse = function () {
                        scope.metadata.statusOfUse = scope.selectedStatusOfUse.key;
                    };

                    scope.selectCorporaType = function () {
                        scope.metadata.corporaType = scope.metadataItemform.corporaLanguageType.$modelValue.key;
                    };

                    scope.selectCorporaLanguageType = function () {
                        scope.metadata.corporaLanguageType = scope.metadataItemform.corporaLanguageType.$modelValue.key;
                    };

                    scope.nextStep = function() {
                        if(scope.stepCurrent==='basic_info') {
                            scope.stepBasicInfoSuccess = stepBasicInfoSuccess();
                            if(scope.stepBasicInfoSuccess) {
                                scope.stepCurrent = 'whos_involved';
                            }
                        } else if(scope.stepCurrent==='whos_involved') {
                            scope.stepWhosInvolvedSuccess = stepWhosInvolvedSuccess();
                            if(scope.stepWhosInvolvedSuccess) {
                                scope.stepCurrent = 'describe';
                            }
                        } else if(scope.stepCurrent==='describe') {
                            scope.stepDescribeSuccess = stepDescribeSuccess();
                            if(scope.stepDescribeSuccess) {
                                scope.stepCurrent = 'licence';
                                scope.scrolltoHref('licence');
                            }
                        } else if(scope.stepCurrent==='licence') {
                            scope.stepLicenceSuccess = stepLicenceSuccess();
                            if(scope.stepLicenceSuccess) {
                                scope.stepCurrent = 'specific_fields';
                                scope.scrolltoHref('specific_fields');
                            }
                        } else if(scope.stepCurrent==='specific_fields') {
                            scope.submitForm();
                        }
                    };

                    function stepBasicInfoSuccess() {
                        if(scope.metadataItemform.type.$valid && scope.metadataItemform.title.$valid && scope.metadataItemform.langtitle.$valid) {
                            return true;
                        } else {
                            scope.metadataItemform.type.$dirty = true;
                            scope.metadataItemform.title.$dirty = true;
                            return false;
                        }
                    }

                    function stepWhosInvolvedSuccess() {
                        if(scope.metadata.contributors.length>0) {
                            return true;
                        }
                        return false;
                    }

                    function stepDescribeSuccess() {
                        if(scope.metadataItemform.description.$valid && scope.metadataItemform.langdescription.$valid) {
                            return true;
                        } else {
                            scope.metadataItemform.description.$dirty = true;
                            return false;
                        }
                    }

                    function stepLicenceSuccess() {
                        if(scope.metadataItemform.statusOfUse.$valid) {
                            return true;
                        } else {
                            scope.metadataItemform.statusOfUse.$dirty = true;
                            return false;
                        }
                    }

                    var deregisterFileLicenceSelectModal = $rootScope.$on('browserSelectedElements-fileLicenceSelectModal', function ($event, elements) {
                        console.log('metadata-form-market-ortolang caught event "browserSelectedElements-fileLicenceSelectModal" (selected elements: %o)', elements);
                        
                        scope.metadata.license = elements[0].path;
                        scope.license = elements[0];
                        scope.fileLicenceSelectModal.hide();
                    });

                    var deregisterFileImageSelectModal = $rootScope.$on('browserSelectedElements-fileImageSelectModal', function ($event, elements) {
                        console.log('metadata-form-market-ortolang caught event "browserSelectedElements-fileImageSelectModal" (selected elements: %o)', elements);
                        
                        scope.metadata.image = elements[0].path;
                        scope.image = elements[0];
                        scope.fileImageSelectModal.hide();
                    });

                    scope.$on('$destroy', function () {
                        deregisterFileLicenceSelectModal();
                        deregisterFileImageSelectModal();
                    });


                    // ScrollSpy //

                    scope.scrolltoHref = function (id) {
                        // set the location.hash to the id of
                        // the element you wish to scroll to.
                        $location.hash(id);
                        // call $anchorScroll()
                        $anchorScroll();
                    };

                    // *********************** //
                    //          Resize         //
                    // *********************** //

                    scope.resizeMetadataItemEditor = function () {
                        var topNavWrapper = angular.element('#top-nav-wrapper'),
                            footerWrapper = angular.element('#footer-wrapper'),
                            topOffset = topNavWrapper.outerHeight(),
                            height = (window.innerHeight > 0) ? window.innerHeight : screen.height,
                            bottomOffset = footerWrapper.outerHeight(),
                            browserToolbarHeight = angular.element('#metadata-item-editor-toolbar').innerHeight();

                        height = height - topOffset - bottomOffset;
                        if (height < 1) {
                            height = 1;
                        }
                        if (height > topOffset) {
                            height -= 1;

                        var editorWrapper = angular.element('.metadata-item-editor'),
                            editorAside = angular.element('.editor-aside'),
                            editorStepHeight = angular.element('.metadata-editor-progress-bar').innerHeight();

                        editorAside.css('min-height', (height - browserToolbarHeight) + 'px');
                        editorWrapper.find('.editor-pane').css('height', (height - browserToolbarHeight - editorStepHeight) + 'px');
                        }
                    };

                    angular.element($window).bind('resize', function () {
                        scope.resizeMetadataItemEditor();
                    });


                    /**
                     * Utils
                     **/

                    function loadAllCorporaTypes() {
                        
                        var queryBuilder = QueryBuilderFactory.make({
                            projection: 'key, meta_ortolang-referentiel-json',
                            source: 'ReferentielEntity'
                        });

                        // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                        queryBuilder.equals('meta_ortolang-referentiel-json.type', 'corporaType');

                        var query = queryBuilder.toString();
                        scope.allCorporaType = [];
                        JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                            angular.forEach(jsonResults, function (result) {
                                var role = angular.fromJson(result);
                                
                                scope.allCorporaType.push({key: role.id, value: role.label});
                            });

                            if(angular.isDefined(scope.metadata.corporaType)) {

                                var corporaTypeFound = $filter('filter')(scope.allCorporaType, {key:scope.metadata.corporaType});
                                if(corporaTypeFound.length>0) {
                                    scope.selectedCorporaType = corporaTypeFound[0];
                                }
                            }

                        });
                    }

                    function loadAllCorporaLanguageType() {
                        
                        var queryBuilder = QueryBuilderFactory.make({
                            projection: 'key, meta_ortolang-referentiel-json',
                            source: 'ReferentielEntity'
                        });

                        // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                        queryBuilder.equals('meta_ortolang-referentiel-json.type', 'corporaLanguageType');

                        var query = queryBuilder.toString();
                        scope.allCorporaLanguageType = [];
                        JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                            angular.forEach(jsonResults, function (result) {
                                var term = angular.fromJson(result);
                                
                                scope.allCorporaLanguageType.push({key: term.id, value: term.label});
                            });

                            if(angular.isDefined(scope.metadata.corporaLanguageType)) {

                                var corporaLanguageTypeFound = $filter('filter')(scope.allCorporaLanguageType, {key:scope.metadata.corporaLanguageType});
                                if(corporaLanguageTypeFound.length>0) {
                                    scope.selectedCorporaLanguageType = corporaLanguageTypeFound[0];
                                }
                            }

                        });
                    }

                    function loadAllCorporaStyles() {
                        
                        var queryBuilder = QueryBuilderFactory.make({
                            projection: 'key, meta_ortolang-referentiel-json',
                            source: 'ReferentielEntity'
                        });

                        // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                        queryBuilder.equals('meta_ortolang-referentiel-json.type', 'corporaStyle');

                        var query = queryBuilder.toString();
                        scope.allCorporaStyles = [];
                        JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                            angular.forEach(jsonResults, function (result) {
                                var term = angular.fromJson(result);
                                
                                scope.allCorporaStyles.push({id: term.id, label: term.label});
                            });

                            if(angular.isDefined(scope.metadata.corporaStyles)) {

                                angular.forEach(scope.metadata.corporaStyles, function(tag) {
                                    var tagFound = $filter('filter')(scope.allCorporaStyles, {id:tag});
                                    if(tagFound.length>0) {
                                        scope.corporaStyleTag.push(tagFound[0]);
                                    } else {
                                        scope.corporaStyleTag.push({id:tag,label:tag});
                                    }
                                });
                            }

                        });
                    }

                    function loadAllAnnotationLevels() {
                        
                        var queryBuilder = QueryBuilderFactory.make({
                            projection: 'key, meta_ortolang-referentiel-json',
                            source: 'ReferentielEntity'
                        });

                        // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                        queryBuilder.equals('meta_ortolang-referentiel-json.type', 'annotationLevel');

                        var query = queryBuilder.toString();
                        scope.allAnnotationLevels = [];
                        JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                            angular.forEach(jsonResults, function (result) {
                                var term = angular.fromJson(result);
                                
                                scope.allAnnotationLevels.push({id: term.id, label: term.label});
                            });

                            if(angular.isDefined(scope.metadata.annotationLevels)) {

                                angular.forEach(scope.metadata.annotationLevels, function(tag) {
                                    var tagFound = $filter('filter')(scope.allAnnotationLevels, {id:tag});
                                    if(tagFound.length>0) {
                                        scope.selectedAnnotationLevels.push(tagFound[0]);
                                    } else {
                                        scope.selectedAnnotationLevels.push({id:tag,label:tag});
                                    }
                                });
                            }

                        });
                    }

                    function loadAllCorporaFormats() {
                        
                        var queryBuilder = QueryBuilderFactory.make({
                            projection: 'key, meta_ortolang-referentiel-json',
                            source: 'ReferentielEntity'
                        });

                        // queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang=fr].value', 'id');
                        queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                        queryBuilder.equals('meta_ortolang-referentiel-json.type', 'corporaFormat');

                        var query = queryBuilder.toString();
                        scope.allCorporaFormats = [];
                        JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                            angular.forEach(jsonResults, function (result) {
                                var term = angular.fromJson(result);
                                
                                scope.allCorporaFormats.push({id: term.id, label: term.label});
                            });

                            if(angular.isDefined(scope.metadata.corporaFormats)) {

                                angular.forEach(scope.metadata.corporaFormats, function(tag) {
                                    var tagFound = $filter('filter')(scope.allCorporaFormats, {id:tag});
                                    if(tagFound.length>0) {
                                        scope.selectedCorporaFormats.push(tagFound[0]);
                                    } else {
                                        scope.selectedCorporaFormats.push({id:tag,label:tag});
                                    }
                                });
                            }

                        });
                    }

                    function init() {
                        if(!angular.isDefined(scope.metadata)) {
                            scope.metadata = {schema: 'http://www.ortolang.fr/schema/012#', contributors:[]};
                        }

                        ObjectResource.size({key: scope.workspace.head}, function (data) {
                            scope.metadata.datasize = data.size.toString();
                        });

                        scope.itemTypes = [ 
                            { 
                                key:'Corpus', 
                                value: $translate.instant('MARKET.ITEM_TYPE.CORPORA') 
                            },
                            { 
                                key:'Lexique', 
                                value: $translate.instant('MARKET.ITEM_TYPE.LEXICON') 
                            },
                            { 
                                key:'Outil', 
                                value: $translate.instant('MARKET.ITEM_TYPE.TOOL') 
                            },
                            { 
                                key:'Application', 
                                value: $translate.instant('MARKET.ITEM_TYPE.INTEGRATED_PROJECT') 
                            }
                        ];
                        if(angular.isDefined(scope.metadata.type)) {

                            var typeFound = $filter('filter')(scope.itemTypes, {key:scope.metadata.type});
                            if(typeFound.length>0) {
                                scope.selectedType = typeFound[0];
                            }
                        }

                        scope.allStatusOfUse = [ 
                            { 
                                key:'Libre', 
                                value: 'Libre'
                            },
                            { 
                                key:'Libre sans utilisation commerciale', 
                                value: 'Libre sans utilisation commerciale' 
                            },
                            { 
                                key:'Libre pour l’enseignement supérieur et la recherche', 
                                value: 'Libre pour l’enseignement supérieur et la recherche'
                            },
                            { 
                                key:'Négociation nécessaire', 
                                value: 'Négociation nécessaire' 
                            }
                        ];
                        if(angular.isDefined(scope.metadata.statusOfUse)) {

                            var statusOfUseFound = $filter('filter')(scope.allStatusOfUse, {key:scope.metadata.statusOfUse});
                            if(statusOfUseFound.length>0) {
                                scope.selectedStatusOfUse = statusOfUseFound[0];
                            }
                        }

                        var fileLicenceSelectModalScope = $rootScope.$new(true);
                        fileLicenceSelectModalScope.acceptMultiple = false;
                        fileLicenceSelectModalScope.forceMimeTypes = ['ortolang/collection', 'text'];
                        fileLicenceSelectModalScope.forceWorkspace = scope.workspace.key;
                        fileLicenceSelectModalScope.forceHead = true;
                        fileLicenceSelectModalScope.fileSelectId = 'fileLicenceSelectModal';
                        scope.fileLicenceSelectModal = $modal({scope: fileLicenceSelectModalScope, title: 'File select', template: 'common/directives/file-select-modal-template.html', show: false});

                        if(angular.isDefined(scope.metadata.license)) {

                            WorkspaceElementResource.get({path: scope.metadata.license, wskey: scope.workspace.key, root: scope.root}).$promise.then(function (data) {
                                scope.license = data;
                            });
                        }

                        var fileImageSelectModalScope = $rootScope.$new(true);
                        fileImageSelectModalScope.acceptMultiple = false;
                        fileImageSelectModalScope.forceMimeTypes = ['ortolang/collection', 'image'];
                        fileImageSelectModalScope.forceWorkspace = scope.workspace.key;
                        fileImageSelectModalScope.forceHead = true;
                        fileImageSelectModalScope.fileSelectId = 'fileImageSelectModal';
                        scope.fileImageSelectModal = $modal({scope: fileImageSelectModalScope, title: 'File select', template: 'common/directives/file-select-modal-template.html', show: false});

                        if(angular.isDefined(scope.metadata.image)) {

                            WorkspaceElementResource.get({path: scope.metadata.image, wskey: scope.workspace.key, root: scope.root}).$promise.then(function (data) {
                                scope.image = data;
                            });
                        }


                        scope.corporaStyleTag = [];
                        scope.selectedAnnotationLevels = [];
                        scope.selectedCorporaFormats = [];

                        loadAllCorporaTypes();
                        loadAllCorporaStyles();
                        loadAllCorporaLanguageType();
                        loadAllAnnotationLevels();
                        loadAllCorporaFormats();

                        scope.stepCurrent = 'basic_info';
                        scope.stepBasicInfoSuccess = false;
                        scope.stepWhosInvolvedSuccess = false;
                        scope.stepDescribeSuccess = false;
                        scope.stepLicenceSuccess = false;
                    }
                    init();
                }
            }
        };
    }]);