'use strict';

describe('Directive: categorySelect', function () {

  // load the directive's module
  beforeEach(module('ortolangMarketApp', 'views/category-select.html'));
  
  //beforeEach(module('my.templates'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {

    scope = $rootScope.$new();
  }));

  it('should have three elements in the select', inject(function ($compile) {
    scope.categoriesLabel = "Categorie";
    scope.categories = [{id: 'id', name: 'name', count: 1}, {id: 'id2', name: 'name2', count: 1}, {id: 'id3', name: 'name3', count: 1}];

    element = angular.element('<category-select></category-select>');
    element = $compile(element)(scope);
    scope.$digest();

    //expect(element.text()).toBe('this is the categorySelect directive');
    var categorySelect = element.find('li');

    expect(categorySelect.length).toEqual(4);
  }));

  it('should have one element in the select', inject(function ($compile) {
    scope.categoriesLabel = "Categorie";
    scope.categories = [];
    
    element = angular.element('<category-select></category-select>');
    element = $compile(element)(scope);
    scope.$digest();

    //expect(element.text()).toBe('this is the categorySelect directive');
    var categorySelect = element.find('li');

    expect(categorySelect.length).toEqual(2);
  }));
});
