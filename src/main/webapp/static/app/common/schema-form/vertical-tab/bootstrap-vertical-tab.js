angular.module('schemaForm').config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
  function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

    // var verticalTab = function(name, schema, options) {
    //   if (schema.type === 'tab' && schema.format === 'vertical') {
    //     var f = schemaFormProvider.stdFormObj(name, schema, options);
    //     f.key  = options.path;
    //     f.type = 'vertical-tab';
    //     options.lookup[sfPathProvider.stringify(options.path)] = f;
    //     return f;
    //   }
    // };

    // schemaFormProvider.defaults.string.unshift(verticalTab);

    //Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping(
      'bootstrapDecorator',
      'vertical-tab',
      'common/schema-form/vertical-tab/vertical-tab.html'
    );
    schemaFormDecoratorsProvider.createDirective(
      'vertical-tab',
      'common/schema-form/vertical-tab/vertical-tab.html'
    );
  }
]);