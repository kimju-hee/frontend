<template>
  <v-container fluid>
    <v-row align="center" justify="center" style="min-height: 100vh;">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="10" class="pa-8">
          <v-card-title class="text-h5 font-weight-bold text-center mb-6">
            로그인
          </v-card-title>
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="email"
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
            <v-row justify="center">
              <v-col cols="12" class="d-flex flex-column align-center">
                <v-btn
                  color="primary"
                  large
                  block
                  class="mb-4"
                  @click="login"
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
            <v-text-field v-model="signupForm.featuredWorks" label="대표작(쉼표로 구분)" outlined dense class="mb-6" />
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
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      loginError: false,

      showSignupDialog: false,
      signupRole: 'reader',
      signupForm: {
        email: '',
        password: '',
        name: '',
        introduction: '',
        featuredWorks: ''
      },
      signupError: false,
    }
  },
  methods: {
    async login() {
      this.loginError = false;

      // 관리자 로그인 시도
      if (this.email === 'admin' && this.password === 'admin') {
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('userId', 9999);
        alert('관리자 로그인 성공!');
        this.$router.push('/admin-home');
        return;
      }

      // 독자 로그인 시도
      try {
        const userResponse = await axios.get(`/users/search/findByEmail?email=${this.email}`);
        if (userResponse.data._embedded.users.length > 0) {
          localStorage.setItem('userType', 'reader');
          localStorage.setItem('userId', userResponse.data._embedded.users[0].id);
          alert('독자 로그인 성공!');
          this.$router.push('/reader-home');
          return;
        }
      } catch (userError) {
        console.warn('독자 로그인 실패 또는 이메일 없음:', userError);
      }

      // 작가 로그인 시도
      try {
        const authorResponse = await axios.get(`/authors/search/findByEmail?email=${this.email}`);
        // TODO: UserRepository.java에 Optional<User> findByEmail(String email); 추가 필요
        if (authorResponse.data._embedded.authors.length > 0) {
          localStorage.setItem('userType', 'author');
          localStorage.setItem('userId', authorResponse.data._embedded.authors[0].id);
          alert('작가 로그인 성공!');
          this.$router.push('/author-home');
          return;
        }
      } catch (authorError) {
        console.warn('작가 로그인 실패 또는 이메일 없음:', authorError);
      }

      // 모든 로그인 시도 실패
      this.loginError = true;
      alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
    },

    closeSignupDialog() {
      this.showSignupDialog = false;
      this.signupForm = { email: '', password: '', name: '', introduction: '', featuredWorks: '' };
      this.signupRole = 'reader';
    },

    async signup() {
      this.signupError = false;

      if (this.signupRole === 'reader') {
        // 독자 회원가입
        try {
          const newReader = {
            email: this.signupForm.email,
            userName: this.signupForm.name,
            isPurchase: false,
            message: '환영합니다!',
          };
          await axios.post('/users', newReader);
          alert('회원가입이 완료되었습니다! 로그인 후 이용해 주세요.');
          this.$router.push('/login');
        } catch (error) {
          this.signupError = true;
          console.error('독자 회원가입 에러:', error);
        }
      } 
      
      else if (this.signupRole === 'author') {
        try {
          const newAuthor = {
            email: this.signupForm.email,
            authorName: this.signupForm.name,
            isApprove: false,
            introduction: this.signupForm.introduction,
            featuredWorks: this.signupForm.featuredWorks,
          };
          await axios.post('/authors', newAuthor);
          alert('회원가입이 완료되었습니다! 로그인 후 이용해 주세요.');
            this.$router.push('/login');
        } catch (error) {
            this.signupError = true;
            console.error('작가 회원가입 에러:', error);
        }
      }
    },
  },
};
</script>
