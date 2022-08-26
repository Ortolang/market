<script>
    import Vue from 'vue'
    import { store, mutations } from './store';

    export default Vue.component('mobile-nav-sidebar-component', {
        computed: {
            isPanelOpen() {
                return store.isNavOpen;
            }
        },
        methods: {
            closeSidebarPanel: mutations.toggleNav,
        }
    });
</script>

<template>
    <div class="sidebar" v-if="isPanelOpen">
        <div class="sidebar-backdrop" @click="closeSidebarPanel"></div>
        <transition name="slide">
            <slot></slot>
        </transition>
    </div>
</template>

<style>
    .slide-enter-active,
    .slide-leave-active
    {
        transition: transform 0.2s ease;
    }

    .slide-enter,
    .slide-leave-to {
        transform: translateX(-100%);
        transition: all 150ms ease-in 0s
    }

    .sidebar-backdrop {
        background-color: rgba(0,0,0,.5);
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        cursor: pointer;
    }

</style>