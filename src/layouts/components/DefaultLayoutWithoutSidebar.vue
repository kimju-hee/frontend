<script setup>
import { VerticalNavLayout } from '@layouts';

// Components
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
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
