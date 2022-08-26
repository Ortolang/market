<script> 
import Vue from 'vue'
import helloItemComponent from './hello-item-component'

export default Vue.component('hello-component', {
  components: {
    'hello-item-component': helloItemComponent
  },
  props: {
    firstName: String,
    lastName: String
  },
  data() {
    return { labo: 'ATILF' };
  }
});
</script>

<template>
  <div id="hello-co">
    <span>Hi, {{ this.firstName }} {{ this.lastName }} from {{ this.labo }} :-D</span>
    <ul>
      <hello-item-component :item="'toto'"></hello-item-component>
    </ul>
  </div>
</template>