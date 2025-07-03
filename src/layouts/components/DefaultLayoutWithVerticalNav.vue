<script setup>
import { VerticalNavLayout } from '@layouts'

// Components
import DrawerContent from '@/layouts/components/DrawerContent.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <v-btn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
          icon
          variant="plain"
        >
          <VIcon icon="mdi-menu" />
        </v-btn>

        <VSpacer />

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-content>
      <DrawerContent />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <!-- <Footer /> -->
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped></style>
