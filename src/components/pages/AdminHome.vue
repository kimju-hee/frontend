<template>
  <v-container fluid class="pa-8">
    <v-row class="mb-6">
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-4">관리자 대시보드</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="6">
        <v-card elevation="2" class="pa-6 d-flex flex-column align-center justify-center">
          <v-icon size="48" color="primary">mdi-account-tie</v-icon>
          <div class="text-h6 font-weight-bold mt-2 mb-4">작가 관리</div>
          <v-btn color="primary" @click="goTo('author')">이동</v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6">
        <v-card elevation="2" class="pa-6 d-flex flex-column align-center justify-center">
          <v-icon size="48" color="info">mdi-account</v-icon>
          <div class="text-h6 font-weight-bold mt-2 mb-4">독자 관리</div>
          <v-btn color="info" @click="goTo('user')">이동</v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6">
        <v-card elevation="2" class="pa-6 d-flex flex-column align-center justify-center">
          <v-icon size="48" color="success">mdi-book-open-page-variant</v-icon>
          <div class="text-h6 font-weight-bold mt-2 mb-4">도서 관리</div>
          <v-btn color="success" @click="goTo('book')">이동</v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6">
        <v-card elevation="2" class="pa-6 d-flex flex-column align-center justify-center">
          <v-icon size="48" color="deep-purple">mdi-robot</v-icon>
          <div class="text-h6 font-weight-bold mt-2 mb-4">AI 처리 결과 대시보드</div>
          <v-btn color="deep-purple" @click="goTo('airesult')">이동</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AdminHome',
  methods: {
    goTo(type) {
      if (type === 'author') {
        this.$router.push('/author-management')
      } else if (type === 'user') {
        this.$router.push('/user-management')
      } else if (type === 'book') {
        this.$router.push('/book-management')
      } else if (type === 'airesult') {
        this.$router.push('/processedResults')
      }
    }
  }
}
</script> 
