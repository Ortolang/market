<script>
import Vue from 'vue'

export default Vue.component('avatar-component', {
  props: {
    emailHash: String,
    size: Number,
    imgClasses: String
  },
  computed: {
      emailHashSrc: function () {
          return 'https://www.gravatar.com/avatar/' + (this.emailHash ? this.emailHash + '?d=retro' : '00000000000000000000000000000000?d=mm') + '&s=' + this.size;
      }
  }
});
</script>

<template>
    <img :width="size + 'px'" :src="emailHashSrc" :class="imgClasses"/>
</template>