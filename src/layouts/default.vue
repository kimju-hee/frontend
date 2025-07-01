<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue'

const route = useRoute()

const noNavigationPaths = ['/login']
const shouldHideNavigation = computed(() => noNavigationPaths.includes(route.path))
</script>

<template>
  <!-- 네비게이션 완전히 숨길 페이지 -->
  <RouterView v-if="shouldHideNavigation" />

  <!-- 기본 레이아웃 -->
  <DefaultLayoutWithVerticalNav v-else>
    <RouterView />
  </DefaultLayoutWithVerticalNav>
</template>

<style lang="scss">
@use "@layouts/styles/default-layout";
</style>
