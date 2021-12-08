<script> 
import Vue from 'vue'

export default Vue.component('hello-item-component', {
  props: {
    item: String,
  },
  data() {
    return { who: 'World' };
  }
});
</script>

<template>
    <li>Hello {{ this.who }} with {{ this.item }} !</li>
</template>