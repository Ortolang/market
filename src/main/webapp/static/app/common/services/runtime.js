'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Runtime
 * @description
 * # Runtime
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('Runtime', ['$rootScope', '$translate', '$modal', '$alert', '$timeout', 'RuntimeResource', 'FormResource', 'Helper', function ($rootScope, $translate, $modal, $alert, $timeout, RuntimeResource, FormResource, Helper) {

        var lastTasksRefresh,
            tasks = [],
            history = {},
            delta = 500;

        // *********************** //
        //          Tasks          //
        // *********************** //

        function getTasks(date) {
            if (!date || lastTasksRefresh < date) {
                lastTasksRefresh = Date.now();
                RuntimeResource.listTasks(function (data) {
                    tasks = data.entries;
                });
            }
        }

        function claimTask(task) {
            RuntimeResource.performTaskAction({id: task.id}, {action: 'claim'}, function () {
                getTasks();
            });
        }

        function unclaimTask(task) {
            RuntimeResource.performTaskAction({id: task.id}, {action: 'unclaim'}, function () {
                getTasks();
            });
        }

        function completeTask(task) {
            FormResource.get({formKey: task.form}, function (form) {
                var modalScope = Helper.createModalScope(true),
                    completeTaskModal;
                modalScope.formData = {};
                modalScope.formFields = JSON.parse(form.definition);
                modalScope.submitText = $translate.instant('TASKS.COMPLETE_TASK');
                modalScope.onSubmit = function () {
                    var variables = [], type;
                    angular.forEach(modalScope.formData, function (value, key) {
                        if (value === true || value === false) {
                            type = 'boolean';
                        } else if (angular.isString(value)) {
                            type = 'string';
                        }
                        variables.push({name: key, value: value, type: type});
                    });
                    RuntimeResource.performTaskAction({id: task.id}, {action: 'complete', variables: variables}, function () {
                        getTasks();
                    });
                    completeTaskModal.hide();
                };
                completeTaskModal = $modal({
                    title: form.name,
                    html: true,
                    scope: modalScope,
                    template: 'profile/templates/runtime-form-modal-template.html',
                    show: true
                });
            });
        }

        function init() {
            getTasks();
        }

        function processTaskEvent(event, message) {
            event.stopPropagation();
            $timeout(function () {
                getTasks(message.date);
            }, delta);
        }

        $rootScope.$on('runtime.task.created', function (event, message) {
            // If we receive the same message we don't process it again
            if (history['runtime.task.created'] && history['runtime.task.created'].date === message.date) {
                return;
            }
            history['runtime.task.created'] = message;
            processTaskEvent(event, message);
            $timeout(function () {
                $alert({title: $translate.instant('TASKS.TASK'), content: $translate.instant('TASKS.TASK_CREATED', {name: message.fromObject}), type: 'danger'});
            }, delta);
        });

        $rootScope.$on('runtime.task.assigned', function (event, message) {
            processTaskEvent(event, message);
        });

        $rootScope.$on('runtime.task.completed', function (event, message) {
            processTaskEvent(event, message);
        });


        return {
            init: init,
            // Tasks
            getTasks: function () { return tasks; },
            claimTask: claimTask,
            unclaimTask: unclaimTask,
            completeTask: completeTask
        };
    }]);
