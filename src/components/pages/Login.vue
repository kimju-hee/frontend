<template>
  <v-container fluid>
    <v-row
      align="center"
      justify="center"
      class="full-height-center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-card
          elevation="10"
          class="pa-6"
        >
          <v-card-title class="text-h5 font-weight-bold text-center mb-4"> 로그인 </v-card-title>
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
              class="mb-4"
              required
            />
            <v-row justify="center">
              <v-col
                cols="12"
                class="d-flex flex-column align-center"
              >
                <v-btn
                  color="primary"
                  large
                  block
                  class="mb-4"
                  @click="login"
                  >로그인</v-btn
                >
                <v-btn
                  color="info"
                  large
                  block
                  @click="showSignupDialog = true"
                  >회원가입</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- 회원가입 다이얼로그 -->
    <v-dialog
      v-model="showSignupDialog"
      max-width="400"
    >
      <v-card
        elevation="10"
        class="pa-6"
      >
        <v-card-title class="text-h5 font-weight-bold text-center"> 회원가입 </v-card-title>
        <v-card-text>
          <div class="btn-group mb-4">
            <v-btn
              :color="signupRole === 'reader' ? 'primary' : 'secondary'"
              :variant="signupRole === 'reader' ? 'flat' : 'outlined'"
              @click="signupRole = 'reader'"
              >읽을래요</v-btn
            >
            <v-btn
              :color="signupRole === 'author' ? 'primary' : 'secondary'"
              :variant="signupRole === 'author' ? 'flat' : 'outlined'"
              @click="signupRole = 'author'"
              >쓸래요</v-btn
            >
          </div>
          <div v-if="signupRole === 'reader'">
            <v-text-field
              v-model="signupForm.email"
              label="아이디(이메일)"
              outlined
              dense
              class="mb-4"
              required
            />
            <v-text-field
              v-model="signupForm.password"
              label="비밀번호"
              type="password"
              outlined
              dense
              class="mb-4"
              required
            />
            <v-text-field
              v-model="signupForm.name"
              label="이름"
              outlined
              dense
              required
            />
          </div>
          <div v-else-if="signupRole === 'author'">
            <v-text-field
              v-model="signupForm.email"
              label="아이디(이메일)"
              outlined
              dense
              class="mb-4"
              required
            />
            <v-text-field
              v-model="signupForm.password"
              label="비밀번호"
              type="password"
              outlined
              dense
              class="mb-4"
              required
            />
            <v-text-field
              v-model="signupForm.name"
              label="이름"
              outlined
              dense
              class="mb-4"
              required
            />
            <v-textarea
              v-model="signupForm.introduction"
              label="소개말"
              outlined
              rows="3"
              class="mb-4"
            />
            <v-text-field
              v-model="signupForm.featuredWorks"
              label="대표작(쉼표로 구분)"
              outlined
              dense
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="secondary"
            text
            @click="closeSignupDialog"
            >취소</v-btn
          >
          <v-btn
            color="primary"
            text
            @click="signup"
            >가입하기</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import BaseRepository from '@/components/repository/BaseRepository.js'
import axios from '@/plugins/axios'

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
        featuredWorks: '',
      },
      signupError: false,
    }
  },
  created() {
    this.userRepository = new BaseRepository(axios, 'users')
    this.authorRepository = new BaseRepository(axios, 'authors')
  },
  methods: {
    // 로그인
    async login() {
      this.loginError = false

      // 관리자 로그인
      if (this.email === 'admin' && this.password === 'admin') {
        localStorage.setItem('userType', 'admin')
        localStorage.setItem('userId', 9999)
        localStorage.setItem('userName', 'admin')
        alert('관리자 로그인 성공!')
        this.$router.push('/admin-home')
        return
      }

      // 독자 로그인
      try {
        const users = await this.userRepository.find({
          apiPath: 'users/search/findByEmail',
          parameters: { email: this.email },
        })

        if (users && users.length > 0) {
          const user = users[0]
          const userId = user._links?.self?.href ? parseInt(user._links.self.href.split('/').pop()) : null

          if (userId !== null && !isNaN(userId)) {
            localStorage.setItem('userType', 'reader')
            localStorage.setItem('userId', userId)
            localStorage.setItem('userName', user.userName)
            alert('독자 로그인 성공!')
            this.$router.push('/reader-home')
            return
          } else {
            console.error('응답에서 독자 ID를 찾을 수 없습니다.')
          }
        }
      } catch (userError) {
        console.warn('독자 로그인 실패 또는 이메일 없음:', userError)
      }

      // 작가 로그인
      try {
        const authors = await this.authorRepository.find({
          apiPath: 'authors/search/findByEmail',
          parameters: { email: this.email },
        })

        if (authors && authors.length > 0) {
          const author = authors[0]
          const authorId = author._links?.self?.href ? parseInt(author._links.self.href.split('/').pop()) : null

          if (authorId !== null && !isNaN(authorId)) {
            localStorage.setItem('userType', 'author')
            localStorage.setItem('userId', authorId)
            localStorage.setItem('userName', author.authorName)
            alert('작가 로그인 성공!')
            this.$router.push('/author-home')
            return
          } else {
            console.error('응답에서 작가 ID를 찾을 수 없습니다.')
          }
        }
      } catch (authorError) {
        console.warn('작가 로그인 실패 또는 이메일 없음:', authorError)
      }

      // 로그인 실패
      this.loginError = true
      alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.')
    },

    // 회원가입 다이얼로그 닫기
    closeSignupDialog() {
      this.showSignupDialog = false
      this.signupForm = {
        email: '',
        password: '',
        name: '',
        introduction: '',
        featuredWorks: '',
      }
      this.signupRole = 'reader'
      this.email = ''
      this.password = ''
    },

    // 회원가입
    async signup() {
      this.signupError = false

      if (this.signupRole === 'reader') {
        try {
          const newReader = {
            email: this.signupForm.email,
            password: this.signupForm.password,
            userName: this.signupForm.name,
            isPurchase: false,
            message: '환영합니다!', // TODO: User.java 오타 수정 필요
          }
          await axios.post('/users', newReader)
          alert('회원가입이 완료되었습니다! 로그인 후 이용해 주세요.')
          this.showSignupDialog = false
          this.email = ''
          this.password = ''
          this.$router.push('/login')
        } catch (error) {
          this.signupError = true
          alert('회원가입에 실패했습니다. 다시 시도해 주세요.')
          console.error('독자 회원가입 에러:', error)
        }
      } else if (this.signupRole === 'author') {
        try {
          const newAuthor = {
            email: this.signupForm.email,
            authorName: this.signupForm.name,
            isApprove: false,
            introduction: this.signupForm.introduction,
            featuredWorks: this.signupForm.featuredWorks,
          }
          await axios.post('/authors', newAuthor)
          alert('회원가입이 완료되었습니다! 로그인 후 이용해 주세요.')
          this.showSignupDialog = false
          this.email = ''
          this.password = ''
          this.$router.push('/login')
        } catch (error) {
          this.signupError = true
          alert('회원가입에 실패했습니다. 다시 시도해 주세요.')
          console.error('작가 회원가입 에러:', error)
        }
      }
    },
  },
}
</script>

<style scoped>
.full-height-center {
  min-height: 100vh;
}
.btn-group {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
