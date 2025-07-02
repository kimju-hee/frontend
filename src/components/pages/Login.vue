<template>
  <v-container fluid>
    <v-row align="center" justify="center" style="min-height: 100vh;">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="10" class="pa-8">
          <v-card-title class="text-h5 font-weight-bold text-center mb-6">
            로그인
          </v-card-title>
          <v-form @submit.prevent="onLogin">
            <v-text-field
              v-model="userID"
              label="아이디(이메일)"
              prepend-inner-icon="mdi-account"
              outlined
              dense
              class="mb-4"
              required
            />
            <v-text-field
              v-model="userPW"
              label="비밀번호"
              type="password"
              prepend-inner-icon="mdi-lock"
              outlined
              dense
              class="mb-6"
              required
            />
            <v-row justify="center">
              <v-col cols="12" class="d-flex flex-column align-center">
                <v-btn
                  color="primary"
                  large
                  block
                  class="mb-4"
                  @click="onLogin"
                >
                  로그인
                </v-btn>
                <v-btn
                  color="info"
                  large
                  block
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
      <v-card elevation="10" class="pa-8">
        <v-card-title class="text-h5 font-weight-bold text-center mb-6">
          회원가입
        </v-card-title>
        <v-card-text>
          <div class="mb-6">
            <v-btn
              :color="signupRole === 'reader' ? 'primary' : 'secondary'"
              class="mr-4"
              :variant="signupRole === 'reader' ? 'flat' : 'outlined'"
              @click="signupRole = 'reader'"
            >
              읽을래요
            </v-btn>
            <v-btn
              :color="signupRole === 'author' ? 'primary' : 'secondary'"
              :variant="signupRole === 'author' ? 'flat' : 'outlined'"
              @click="signupRole = 'author'"
            >
              쓸래요
            </v-btn>
          </div>
          <div v-if="signupRole === 'reader'">
            <v-text-field v-model="signupForm.email" label="아이디(이메일)" outlined dense class="mb-4" required />
            <v-text-field v-model="signupForm.password" label="비밀번호" type="password" outlined dense class="mb-4" required />
            <v-text-field v-model="signupForm.name" label="이름" outlined dense class="mb-6" required />
          </div>
          <div v-else-if="signupRole === 'author'">
            <v-text-field v-model="signupForm.email" label="아이디(이메일)" outlined dense class="mb-4" required />
            <v-text-field v-model="signupForm.password" label="비밀번호" type="password" outlined dense class="mb-4" required />
            <v-text-field v-model="signupForm.name" label="이름" outlined dense class="mb-4" required />
            <v-textarea v-model="signupForm.introduction" label="소개말" outlined rows="3" class="mb-4" />
            <v-text-field v-model="signupForm.works" label="대표작(쉼표로 구분)" outlined dense class="mb-6" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            text
            @click="closeSignupDialog"
          >
            취소
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="signup"
          >
            가입하기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios';

export default {
  name: 'login',
  data() {
    return {
      userID: '',
      userPW: '',
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
      if (this.userID === 'admin' && this.userPW === 'admin') {
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('userId', 999);
        this.$router.push('/admin-home');
        alert('관리자로 로그인되었습니다!');
        return;
      }
      // 독자/작가 로그인
      try {
        const readerRes = await axios.get('/users/search/findByEmail', {
          params: {
            email: this.userID,
          }
        });

        if (readerRes.data && readerRes.data.id) {
          localStorage.setItem('userType', 'reader');
          localStorage.setItem('userId', readerRes.data.id);
          this.$router.push('/reader-home');
          return;
        }
      } catch (e) {}

      try {
        const authorRes = await axios.get('/authors/search/findByEmail', { // TODO: 백엔드 API 구현 필요
          params: {
            email: this.userID,
          }
        });

        if (authorRes.data && authorRes.data.id) {
          localStorage.setItem('userType', 'author');
          localStorage.setItem('userId', authorRes.data.id);
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
        const path = this.signupRole === 'reader' ? '/users' : '/authors';

        const payload = {
          email: this.signupForm.email,
        };

        if (this.signupRole === 'reader') {
          payload.userName = this.signupForm.name;
          payload.isPurchase = false;
          payload.message = '';
        } else if (this.signupRole === 'author') {
          payload.authorName = this.signupForm.name;
          payload.introduction = this.signupForm.introduction;
          payload.featuredWorks = this.signupForm.works;
          payload.portfolios = [];
          payload.isApprove = false;
        }

        const response = await axios.post(path, payload);

        alert('회원가입이 완료되었습니다. 로그인 후 이용해 주세요.');
      } catch (e) {
        alert('회원가입 실패: 입력 정보를 확인하세요.');
      }
    }
  }
}
</script>
