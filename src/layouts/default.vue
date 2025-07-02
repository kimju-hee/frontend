<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue'
import DefaultLayoutWithoutSidebar from './components/DefaultLayoutWithoutSidebar.vue'

const route = useRoute()

const noNavigationPaths = ['/login']
const noSidebarPaths = ['/author-home', '/reader-home', '/book-list']

const shouldHideNavigation = computed(() => noNavigationPaths.includes(route.path))
const shouldHideSidebar = computed(() => noSidebarPaths.includes(route.path))
</script>

<template>
  <!-- 네비게이션 숨김 페이지 -->
  <RouterView v-if="shouldHideNavigation" />

  <!-- 사이드바만 숨김 페이지들 -->
  <DefaultLayoutWithoutSidebar v-else-if="shouldHideSidebar">
    <RouterView />
  </DefaultLayoutWithoutSidebar>

  <!-- 기본 레이아웃 -->
  <DefaultLayoutWithVerticalNav v-else>
    <RouterView />
  </DefaultLayoutWithVerticalNav>
</template>

<style lang="scss">
@use "@layouts/styles/default-layout";
</style>
