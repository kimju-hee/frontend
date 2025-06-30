<script setup>
import { VerticalNavLayout } from '@layouts';

// Components
import DrawerContent from '@/layouts/components/DrawerContent.vue';
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="mdi-menu" />
        </IconBtn>

        <VSpacer />

        <!-- 👉 Logout button -->
        <v-btn
          color="error"
          variant="outlined"
          size="small"
          @click="logout"
        >
          <v-icon left>mdi-logout</v-icon>
          로그아웃
        </v-btn>
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

<script>
export default {
  methods: {
    logout() {
      // 로그아웃 처리
      localStorage.removeItem('userType')
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
