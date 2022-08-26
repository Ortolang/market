<script>
import Vue from 'vue'
import { store, mutations } from './store';

export default Vue.component('mobile-nav-button-component', {
    computed: {
        isButtonActive() {
            return store.isNavOpen;
        }
    },
    methods: {
        toggle() {
            mutations.toggleNav();
        }
    }
});
</script>
<template>
    <div id="mobile-nav-button" :class="{ 'active' : isButtonActive}" @click.prevent="toggle">
        <slot>
            <button type="button" class="navbar-toggle">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </slot>
    </div>
</template>
