<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" style="min-height: 100vh;">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="10" class="pa-8">
          <v-card-title class="text-h5 font-weight-bold text-center mb-6">
            로그인
          </v-card-title>
          <v-form @submit.prevent="onLogin">
            <v-text-field
              v-model="userId"
              label="아이디"
              prepend-inner-icon="mdi-account"
              outlined
              dense
              class="mb-4"
              required
            />
            <v-text-field
              v-model="password"
              label="비밀번호"
              type="password"
              prepend-inner-icon="mdi-lock"
              outlined
              dense
              class="mb-6"
              required
            />
            <v-row class="mb-2" justify="center">
              <v-col cols="12" class="d-flex flex-column align-center">
                <v-btn
                  color="primary"
                  class="mb-2"
                  large
                  block
                  @click="login('author')"
                >
                  작가 시작하기
                </v-btn>
                <v-btn
                  color="secondary"
                  class="mb-2"
                  large
                  block
                  @click="login('reader')"
                >
                  독자 시작하기
                </v-btn>
                <v-btn
                  color="success"
                  large
                  block
                  @click="login('admin')"
                >
                  관리자 시작하기
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      userId: '',
      password: '',
    }
  },
  methods: {
    login(role) {
      // 실제 로그인 로직은 추후 구현, 지금은 바로 해당 페이지로 이동
      // 아이디/비밀번호 유효성 검사는 생략
      
      // 사용자 타입을 localStorage에 저장
      localStorage.setItem('userType', role)
      
      if (role === 'admin') {
        this.$router.push('/admin');
      } else if (role === 'author') {
        this.$router.push('/author');
      } else {
        this.$router.push('/');
      }
    },
    onLogin() {
      // 폼 제출 시 기본 동작 (작가 시작하기로 처리)
      this.login('author');
    }
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style> 
