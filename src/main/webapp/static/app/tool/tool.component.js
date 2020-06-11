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
        },
        controller: ['$timeout', '$http', '$resource',
            function ($timeout, $http, $resource) {
                var ctrl = this, myTimeout;

                function refreshOutput() {
                    ctrl.toolResource.getJob({ id: ctrl.jobId }, function(data) {
                        if (data.state == 'COMPLETED') {
                            ctrl.builds = data.outputFiles;
                            myTimeout = $timeout(getBuildOutput, 1000);
                            ctrl.submitText = null;
                            ctrl.enableSubmit = '';
                        } else if (data.state == 'ABORTED') {
                            console.log("job aborted");
                            alert("job alerted");
                            ctrl.submitText = null;
                            ctrl.enableSubmit = '';
                        } else {
                            myTimeout = $timeout(refreshOutput, 1000);
                        }
                    });
                    console.log("Waiting 1s before refreshing status...");
                }

                function getBuildOutput() {
                    $http({
                        method: 'GET',
                        url: ctrl.baseurl + '/api/jobs/' + ctrl.jobId + "/build/" + ctrl.builds[0],
                        transformResponse: [function (data) {
                            return data;
                        }]
                    }).then(function successCallback(response) {
                        ctrl.output = response.data;
                        ctrl.outputUrl = ctrl.baseurl + '/api/jobs/' + ctrl.jobId + "/build/" + ctrl.builds[0];
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
                /**
                 * Sends a request to the tool.
                 */
                ctrl.execute = function () {
                    var uploadfiles = ctrl.formoptions.formState.uploadfiles;
                    if (angular.isDefined(uploadfiles) && uploadfiles.length > 0) {
                        sendFile(uploadfiles);
                    } else {
                        send();
                    }
                    ctrl.submitText = "MARKET.EXECUTING";
                    ctrl.enableSubmit = 'disabled';
                };

                function send() {
                    var variables = {};
                    angular.forEach(ctrl.formdata, function (value, key) {
                        variables[key] = value;
                    });
                    ctrl.toolResource.createJob(variables, function (data) {
                        ctrl.jobId = data.id;
                        refreshOutput();
                    }, function (data) {
                        console.log("create job failed !!");
                        alert("job alerted");
                        ctrl.submitText = null;
                        ctrl.enableSubmit = '';
                    });
                }

                function sendFile (files) {
                    var fd = new FormData();
                    angular.forEach(ctrl.formdata, function (value, key) {
                        fd.append(key, value);
                    });
                    angular.forEach(files, function (file, key) {
                        fd.append('input-file', file);
                    });

                    ctrl.toolResource.createJobWithFile({}, fd, function (data) {
                        ctrl.jobId = data.id;
                        refreshOutput();
                        }, function (error) {
                            console.log("create job with file failed !!");
                            alert("job alerted");
                            ctrl.submitText = null;
                            ctrl.enableSubmit = '';
                        }
                    );
                }
                /**
                 * Resets form.
                 */
                ctrl.reset = function () {
                    ctrl.output = null;
                    ctrl.outputUrl = null;
                    ctrl.builds = [];
                    $timeout.cancel(myTimeout);
                    ctrl.jobId = null;
                    ctrl.formoptions.formState.uploadfiles = [];
                    ctrl.formdata = {};
                    ctrl.submitText = null;
                    ctrl.enableSubmit = '';
                };

                ctrl.$onInit = function () {
                    ctrl.submitText = null;
                    ctrl.enableSubmit = '';
                    ctrl.output = null;
                    ctrl.builds = [];
                    ctrl.toolResource = $resource('/api/jobs', {}, {
                        createJob: {
                            method: 'POST',
                            url: ctrl.baseurl + '/api/jobs',
                            transformRequest: function (data) { return $.param(data); },
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        },
                        createJobWithFile: {
                            method: 'POST',
                            url: ctrl.baseurl + '/api/jobs',
                            transformRequest: angular.identity,
                            headers: { 'Content-Type': undefined }
                        },
                        getJob: {
                            method: 'GET',
                            url: ctrl.baseurl + '/api/jobs/:id'
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