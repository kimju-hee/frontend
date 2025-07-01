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
              label="아이디(이메일)"
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
                  large
                  block
                  @click="onLogin"
                >
                로그인
                </v-btn>
                <v-btn
                  color="info"
                  large
                  block
                  class="mt-4"
                  @click="showSignupDialog = true"
                >
                회원가입
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- 회원가입 다이얼로그 -->
    <v-dialog v-model="showSignupDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">회원가입</v-card-title>
        <v-card-text>
          <div class="mb-4">
            <v-btn
              color="secondary"
              class="mr-2"
              :variant="signupRole === 'reader' ? 'flat' : 'outlined'"
              @click="signupRole = 'reader'"
            >
              독자
            </v-btn>
            <v-btn
              color="primary"
              :variant="signupRole === 'author' ? 'flat' : 'outlined'"
              @click="signupRole = 'author'"
            >
              작가
            </v-btn>
          </div>
          <div v-if="signupRole === 'reader'">
            <v-text-field v-model="signupForm.email" label="이메일" outlined dense class="mb-2" />
            <v-text-field v-model="signupForm.password" label="비밀번호" type="password" outlined dense class="mb-2" />
            <v-text-field v-model="signupForm.name" label="이름" outlined dense class="mb-2" />
          </div>
          <div v-else-if="signupRole === 'author'">
            <v-text-field v-model="signupForm.email" label="이메일" outlined dense class="mb-2" />
            <v-text-field v-model="signupForm.password" label="비밀번호" type="password" outlined dense class="mb-2" />
            <v-text-field v-model="signupForm.name" label="이름" outlined dense class="mb-2" />
            <v-textarea v-model="signupForm.introduction" label="작가 소개" outlined rows="3" class="mb-2" />
            <v-text-field v-model="signupForm.works" label="대표작 (쉼표로 구분)" outlined dense class="mb-2" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeSignupDialog">취소</v-btn>
          <v-btn color="primary" @click="signup">가입하기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data() {
    return {
      userId: '',
      password: '',
      showSignupDialog: false,
      signupRole: 'reader',
      signupForm: {
        email: '',
        password: '',
        name: '',
        introduction: '',
        works: ''
      }
    }
  },
  methods: {
    async login() {
      // 관리자 로그인
      if (this.userId === 'admin' && this.password === 'admin') {
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('userEmail', 'admin');
        localStorage.setItem('userName', '관리자');
        this.$router.push('/admin-home');
        return;
      }
      // 독자/작가 로그인
      try {
        const userRes = await axios.get('/users/search/findByEmailAndPassword', { // 백엔드 HATEOAS 구현 필요
          params: {
            email: this.email,
            password: this.password
          }
        });

        if (userRes.data && userRes.data.id) {
          localStorage.setItem('userType', 'reader');
          localStorage.setItem('userEmail', userRes.data.email);
          localStorage.setItem('userName', userRes.data.name || '');
          this.$router.push('/reader-home');
          return;
        }
      } catch (e) {}

      try {
        const authorRes = await axios.get('/authors/search/findByEmailAndPassword', { // 백엔드 HATEOAS 구현 필요
          params: {
            email: this.email,
            password: this.password
          }
        });

        if (authorRes.data && authorRes.data.id) {
          localStorage.setItem('userType', 'author');
          localStorage.setItem('userEmail', authorRes.data.email);
          localStorage.setItem('userName', authorRes.data.name || '');
          this.$router.push('/author-home');
          return;
        }
      } catch (e) {}

      alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    },
    async onLogin() {
      await this.login();
    },
    closeSignupDialog() {
      this.showSignupDialog = false;
      this.signupForm = { email: '', password: '', name: '', introduction: '', works: '' };
      this.signupRole = 'reader';
    },
    async signup() {
      try {
        const resourcePath = this.signupRole === 'reader' ? 'users' : 'authors';

        const payload = {
          email: this.signupForm.email,
          password: this.signupForm.password,
          name: this.signupForm.name,
        };

        if (this.signupRole === 'author') {
          payload.introduction = this.signupForm.introduction;
          payload.featuredWorks = this.signupForm.works;
          payload.isApprove = false;
        }

        const res = await axios.post(`/${resourcePath}`, payload);

        const selfLink = res.data._links?.self?.href || null;

        this.closeSignupDialog();
        this.email = '';
        this.password = '';

        if (selfLink) {
          console.log('등록된 리소스:', selfLink);
        }

        alert('회원가입이 완료되었습니다. 로그인 후 이용해 주세요.');
      } catch (e) {
        alert('회원가입 실패: 입력 정보를 확인하세요.');
      }
    }
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
