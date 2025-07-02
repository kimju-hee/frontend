<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const avatarBadgeProps = {
  dot: true,
  location: 'bottom right',
  offsetX: 3,
  offsetY: 3,
  color: 'success',
  bordered: true,
}

const userName = localStorage.getItem('userName') || "USER"

const handleLogout = () => {
  // localStorage 초기화
  localStorage.clear()
  
  // 또는 특정 키만 삭제하려면:
  // localStorage.removeItem('userId')
  // localStorage.removeItem('userName')
  // localStorage.removeItem('userRole')
  // localStorage.removeItem('token')
  
  // 로그인 페이지로 이동
  router.push('/login')
}
</script>

<template>
  <VBadge v-bind="avatarBadgeProps">
    <VAvatar
      style="cursor: pointer;"
      color="primary"
      variant="tonal"
    >
      <VIcon icon="mdi-account" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge v-bind="avatarBadgeProps">
                  <VAvatar
                    color="primary"
                    size="40"
                    variant="tonal"
                  >
                    <VIcon icon="mdi-account" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ userName }}
            </VListItemTitle>
          </VListItem>

          <VDivider class="my-2" />
          
          <!-- 👉 Logout -->
          <VListItem @click="handleLogout">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-logout-variant"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>