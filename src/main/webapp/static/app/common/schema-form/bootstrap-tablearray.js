angular.module('schemaForm').config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
  function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

    // var tablearray = function(name, schema, options) {
    //   if (schema.type === 'array' && schema.format === 'tablearray') {
    //     var f = schemaFormProvider.stdFormObj(name, schema, options);
    //     f.key  = options.path;
    //     f.type = 'tablearray';
    //     options.lookup[sfPathProvider.stringify(options.path)] = f;
    //     return f;
    //   }
    // };

    // schemaFormProvider.defaults.string.unshift(tablearray);

    //Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping(
      'bootstrapDecorator',
      'tablearray',
      'common/schema-form/tablearray.html'
    );
    schemaFormDecoratorsProvider.createDirective(
      'tablearray',
      'common/schema-form/tablearray.html'
    );
  }
]);