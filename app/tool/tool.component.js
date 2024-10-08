'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:tool
 * @description
 * # tool
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('tool', {
        bindings: {
            title: '@?',
            baseurl: '@?',
            formdata: '=',
            formfields: '=',
            workspace: '@?',
            path: '@?'
        },
        controller: ['$timeout', '$http', '$window', '$resource', '$translate', 'Helper',
            function ($timeout, $http, $window, $resource, $translate, Helper) {
                var ctrl = this, myTimeout;

                function refreshOutput() {
                    let queryParams = {id: ctrl.jobId};
                    if (angular.isDefined(ctrl.jobCode)) {
                        queryParams.sessionId = ctrl.jobCode;
                    }
                    ctrl.ortolangRunnerResource.getJob(queryParams, function(data) {
                        if (data.state == 'COMPLETED') {
                            ctrl.builds = data.outputFiles;
                            ctrl.submitText = null;
                            ctrl.enableSubmit = '';
                            downloadStdout(ctrl.jobCode);
                            // if workspace then upload outputs
                            if (angular.isDefined(ctrl.workspace) && ctrl.workspace !== '') {
                                if (ctrl.builds.length > 0) {
                                    ctrl.uploadOutput(ctrl.workspace);
                                } else {
                                    Helper.showNotificationMessage({
                                        title: $translate.instant('EXECUTION_DONE.TITLE'),
                                        body:  $translate.instant('EXECUTION_DONE.BODY')
                                    });
                                }
                            } else if (ctrl.builds.length > 0) {
                                ctrl.outputUrl = ctrl.baseurl + '/jobs/' + ctrl.jobId + "/file/" + ctrl.builds[0];
                                if (angular.isDefined(ctrl.jobCode) && ctrl.jobCode !== '') {
                                    ctrl.outputUrl += '?sessionId=' + ctrl.jobCode;
                                }
                            }
                            ctrl.executionCompleted = true;
                        } else if (data.state == 'ABORTED') {
                            console.log("job aborted");
                            console.debug(data);
                            Helper.showNotificationMessage(
                                {title: $translate.instant('ERROR_MODAL_10.TITLE'), body: $translate.instant('ERROR_MODAL_10.BODY')}
                            );
                            ctrl.submitText = null;
                            ctrl.enableSubmit = '';
                        } else {
                            myTimeout = $timeout(refreshOutput, 1000);
                        }
                    });
                    console.debug("Waiting 1s before refreshing status...");
                }

                function downloadStdout(sessionId) {
                    let urlBuildOutput = ctrl.baseurl + '/jobs/' + ctrl.jobId + "/stdout";
                    if (angular.isDefined(sessionId) && sessionId !== '') {
                        urlBuildOutput += "?sessionId=" + sessionId;
                    }
                    $http({
                        method: 'GET',
                        url: urlBuildOutput,
                        transformResponse: [function (data) {
                            return data;
                        }]
                    }).then(function successCallback(response) {
                        ctrl.stdout = response.data;
                    }, function errorCallback(response) {
                        console.log(response);
                        Helper.showNotificationMessage(
                            {title: $translate.instant('ERROR_MODAL_11.TITLE'), body: $translate.instant('ERROR_MODAL_11.BODY')}
                        );
                    });
                }

                ctrl.downloadFile = function() {
                    $window.open(ctrl.outputUrl);
                }

                ctrl.uploadOutput = function (wskey) {
                    angular.forEach(ctrl.builds, function (buildFile) {
                        // Asks for uploading only the firts output file
                        ctrl.ortolangRunnerResource.transfer({
                            'job': ctrl.jobId,
                            'wskey': wskey,
                            'path': ctrl.path + (ctrl.path !== '/' ? '/' : '') + buildFile,
                            'file': ctrl.builds[0]
                        }, function (data) {
                            console.debug(data);
                            Helper.showNotificationMessage({
                                title: $translate.instant('EXECUTION_DONE.TITLE'),
                                body:  $translate.instant('EXECUTION_DONE.BODY')
                            });
                        }, function (data) {
                            console.error(data);
                            Helper.showNotificationMessage(
                                {title: $translate.instant('ERROR_MODAL_12.TITLE'), body: $translate.instant('ERROR_MODAL_12.BODY')}
                            );
                        });
                    });
                }

                /**
                 * Sends a request to the tool.
                 */
                ctrl.execute = function () {
                    resetDisplay();
                    var uploadfiles = ctrl.formoptions.formState;
                    if (angular.isDefined(uploadfiles) && Object.keys(uploadfiles).length > 0) {
                        console.debug("send with file");
                        sendFile(uploadfiles);
                    } else {
                        console.debug("send");
                        send();
                    }
                    ctrl.submitText = "MARKET.EXECUTING";
                    ctrl.enableSubmit = 'disabled';
                };

                function send() {
                    let job = { parameters : ctrl.formdata };
                    ctrl.ortolangRunnerResource.createJob(job, function (data) {
                        ctrl.jobId = data.id;
                        ctrl.jobCode = data.userSessionId;
                        refreshOutput();
                    }, function (data) {
                        console.log("create job failed when send !!");
                        console.debug(data);
                        Helper.showNotificationMessage(
                            {title: $translate.instant('ERROR_MODAL_10.TITLE'), body: $translate.instant('ERROR_MODAL_10.BODY')}
                        );
                        ctrl.submitText = null;
                        ctrl.enableSubmit = '';
                    });
                }

                function sendFile (files) {
                    let fd = new FormData();
                    angular.forEach(ctrl.formdata, function (value, key) {
                        fd.append(key, value);
                    });
                    angular.forEach(files, function (file, key) {
                        fd.append(key, file);
                    });
                    ctrl.ortolangRunnerResource.createJobWithFile({}, fd, function (data) {
                        ctrl.jobId = data.id;
                        ctrl.jobCode = data.userSessionId;
                        refreshOutput();
                        }, function (error) {
                            console.log("create job with file failed when send file !!");
                            console.log(error);
                            Helper.showNotificationMessage(
                                {title: $translate.instant('ERROR_MODAL_10.TITLE'), body: $translate.instant('ERROR_MODAL_10.BODY')}
                            );
                            ctrl.submitText = null;
                            ctrl.enableSubmit = '';
                        }
                    );
                }

                function resetDisplay() {
                    ctrl.stdoutVisibility = false;
                    ctrl.executionCompleted = false;
                }

                ctrl.showOutput = function () {
                    ctrl.stdoutVisibility = true;
                }

                ctrl.hideOutput = function () {
                    ctrl.stdoutVisibility = false;
                }

                /**
                 * Resets form.
                 */
                ctrl.reset = function () {
                    ctrl.stdout = null;
                    ctrl.stdoutVisibility = false;
                    ctrl.executionCompleted = false;
                    ctrl.outputUrl = null;
                    ctrl.builds = [];
                    $timeout.cancel(myTimeout);
                    ctrl.jobId = null;
                    ctrl.jobCode = null;
                    ctrl.formoptions.formState = {};
                    ctrl.formdata = {};
                    ctrl.submitText = null;
                    ctrl.enableSubmit = '';
                };

                ctrl.$onInit = function () {
                    ctrl.submitText = null;
                    ctrl.enableSubmit = '';
                    ctrl.stdout = null;
                    ctrl.jobCode = null;
                    ctrl.stdoutVisibility = false;
                    ctrl.executionCompleted = false;
                    ctrl.builds = [];
                    ctrl.ortolangRunnerResource = $resource(ctrl.baseurl + '/jobs', {}, {
                        createJob: {
                            method: 'POST',
                            url: ctrl.baseurl + '/jobs',
                        },
                        createJobWithFile: {
                            method: 'POST',
                            url: ctrl.baseurl + '/jobs',
                            transformRequest: angular.identity,
                            headers: { 'Content-Type': undefined }
                        },
                        getJob: {
                            method: 'GET',
                            url: ctrl.baseurl + '/jobs/:id'
                        },
                        transfer: {
                            method: 'POST',
                            url: ctrl.baseurl + '/transfer',
                        }
                    });
                }

                ctrl.$onDestroy = function () {
                    $timeout.cancel(myTimeout);
                }; 
            }
        ],
        templateUrl: 'tool/tool.component.html'
    });