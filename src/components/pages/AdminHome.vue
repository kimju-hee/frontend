<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="text-center mb-8">
        <h1 class="text-h3 font-weight-bold mb-4">
          관리자 대시보드
        </h1>
        <p class="text-h6 text-medium-emphasis">
          도서 플랫폼 관리 시스템
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="(item, index) in adminItems" :key="index" cols="12" md="4" class="mb-6">
        <v-card 
          class="admin-card h-100" 
          elevation="4" 
          @click="navigateTo(item.link)"
          hover
        >
          <v-card-text class="text-center pa-8">
            <v-icon :icon="item.icon" size="80" :color="item.color" class="mb-4"></v-icon>
            <h3 class="text-h5 font-weight-bold mb-3">{{ item.title }}</h3>
            <p class="text-body-1 text-medium-emphasis mb-4">{{ item.description }}</p>
            <v-btn 
              :color="item.color" 
              variant="outlined" 
              size="large"
              block
            >
              {{ item.buttonText }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AdminHome',
  data() {
    return {
      adminItems: [
        {
          title: '작가 관리',
          description: '등록된 작가들의 정보를 관리하고 승인/거부를 처리합니다.',
          icon: 'mdi-account-edit',
          color: 'primary',
          buttonText: '작가 관리하기',
          link: '/authors'
        },
        {
          title: '원고 관리',
          description: '제출된 원고를 검토하고 출판 승인을 관리합니다.',
          icon: 'mdi-file-document-edit',
          color: 'secondary',
          buttonText: '원고 관리하기',
          link: '/manuscripts'
        },
        {
          title: 'AI 자동화 관리',
          description: 'AI 도서 생성 시스템을 관리하고 결과를 모니터링합니다.',
          icon: 'mdi-robot',
          color: 'success',
          buttonText: 'AI 관리하기',
          link: '/aiBookGenerations'
        },
        {
          title: '포인트 관리',
          description: '사용자 포인트 시스템을 관리하고 포인트 정책을 설정합니다.',
          icon: 'mdi-currency-usd',
          color: 'warning',
          buttonText: '포인트 관리하기',
          link: '/points'
        },
        {
          title: '독자 관리',
          description: '등록된 독자들의 정보와 구독 상태를 관리합니다.',
          icon: 'mdi-account-group',
          color: 'info',
          buttonText: '독자 관리하기',
          link: '/users'
        },
        {
          title: '도서 관리',
          description: '출판된 도서들을 관리하고 카탈로그를 업데이트합니다.',
          icon: 'mdi-book-open-variant',
          color: 'error',
          buttonText: '도서 관리하기',
          link: '/books'
        }
      ]
    }
  },
  methods: {
    navigateTo(link) {
      this.$router.push(link);
    }
  }
}
</script>

<style scoped>
.admin-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 16px;
}

.admin-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}
</style> 