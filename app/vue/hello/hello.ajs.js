
import helloComponent from './hello-component'

var app = angular.module('vue.components.hello', ['ngVue']).controller('HelloController', function () {
    this.person = {
      firstName: 'The',
      lastName: 'World'
    }
  });

app.value('HelloComponent', helloComponent);