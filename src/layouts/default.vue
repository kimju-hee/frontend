<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue'
import DefaultLayoutWithoutSidebar from './components/DefaultLayoutWithoutSidebar.vue'

const route = useRoute()

// 네비게이션 없이 표시할 경로들 (완전히 숨김)
const noNavigationPaths = ['/']
// 사이드바만 숨길 경로들 (상단 네비게이션은 유지)
const noSidebarPaths = ['/author']

const shouldHideNavigation = computed(() => noNavigationPaths.includes(route.path))
const shouldHideSidebar = computed(() => noSidebarPaths.includes(route.path))
</script>

<template>
  <!-- 네비게이션 완전히 숨길 페이지들 -->
  <RouterView v-if="shouldHideNavigation" />
  
  <!-- 사이드바만 숨길 페이지들 -->
  <DefaultLayoutWithoutSidebar v-else-if="shouldHideSidebar">
    <RouterView />
  </DefaultLayoutWithoutSidebar>
  
  <!-- 다른 페이지일 때는 기본 레이아웃 사용 -->
  <DefaultLayoutWithVerticalNav v-else>
    <RouterView />
  </DefaultLayoutWithVerticalNav>
</template>

<style lang="scss">
@use "@layouts/styles/default-layout";
</style>
