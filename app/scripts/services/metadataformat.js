'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.MetadataFormat
 * @description
 * # MetadataFormat
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
  .factory('MetadataFormat', function () {
    
    var MetadataEditor = function (data) {
    angular.extend(this, {
      id: '',
      name: '',
      format: '',
      view: '',
 
      isCompatible: function(format) {
        return this.format === format;
      }
    }, data);
  };
 
  return MetadataEditor;

    // var id, form;
    
    // // Public API here
    // return {
    //     getId: function () {
    //         return id;
    //     },

    //     setId: function (_id_) {
    //         id = _id_;
    //         return this;
    //     },

    //     getForm: function () {
    //         return form;
    //     },

    //     setForm: function (_form_) {
    //         form = _form_;
    //         return this;
    //     },
    // };
});
