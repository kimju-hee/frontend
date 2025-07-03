<template>
  <v-container
    fluid
    class="pa-8"
  >
    <!-- 인사말 및 유저 정보 -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">{{ userName }}님, 환영합니다!</h1>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 포인트 및 구독 현황 -->
    <v-row class="mb-8">
      <v-col
        cols="12"
        md="6"
      >
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>포인트 현황</span>
            <v-btn
              color="primary"
              @click="chargePointDialog = true"
              >충전</v-btn
            >
          </v-card-title>
          <v-card-text>
            <div class="text-h5 font-weight-bold">{{ point }} P</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>월정액 구독</span>
            <div>
              <v-btn
                v-if="!isPurchase"
                color="primary"
                @click="buySubscriptionDialog = true"
                >구독 신청</v-btn
              >
              <v-btn
                v-else
                color="error"
                @click="cancelSubscriptionDialog = true"
                >구독 해지</v-btn
              >
            </div>
          </v-card-title>
          <v-card-text>
            <div class="text-h5 font-weight-bold">
              {{ isPurchase ? '구독 중' : '미구독' }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 대여 도서 목록 -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>대여한 도서 목록</span>
            <v-btn
              color="primary"
              variant="outlined"
              @click="$router.push('/book-list')"
            >
              <v-icon
                left
                class="mr-2"
                >mdi-book-open-variant</v-icon
              >
              전체 도서 목록 보기
            </v-btn>
          </v-card-title>
          <v-card-text>
            <VDataTable
              :headers="headers"
              :items="rentedBooks"
              :loading="loading"
              class="elevation-0"
              @click:row="item => $router.push(`/book/${item.id}`)"
            >
              <template #item.coverImage="{ item }">
                <v-img
                  :src="
                    item.coverImage ||
                    'https://llaestheticstx.com/wp-content/uploads/2024/12/image-placeholder-vertical.jpg'
                  "
                  max-width="120"
                  max-height="160"
                  aspect-ratio="1"
                />
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon
                  small
                  color="error"
                  @click.stop="deleteBook(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </VDataTable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 포인트 충전 다이얼로그 -->
    <v-dialog
      v-model="chargePointDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title
          class="text-center text-h5 font-weight-bold"
          style="margin-top: 24px"
          >얼마를 충전할까요?</v-card-title
        >
        <v-card-text>
          <div
            style="position: relative; display: flex; justify-content: center; align-items: center; min-height: 120px"
          >
            <div
              style="
                min-width: 220px;
                min-height: 64px;
                border: 2px solid;
                border-radius: 0;
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.2rem;
                font-weight: bold;
                color: #6c63ff;
                margin: 0 auto;
              "
            >
              <span style="color: #6c63ff"
                >{{ chargeAmount.toLocaleString() }}<span style="margin-left: 4px">P</span></span
              >
            </div>
            <v-btn
              color="primary"
              variant="plain"
              @click="resetAmount"
              style="
                position: absolute;
                left: 50%;
                transform: translateX(120px) translateY(-50%);
                top: 50%;
                height: 56px;
                width: 56px;
                align-items: center;
                display: flex;
              "
            >
              <v-icon size="24">mdi-refresh</v-icon>
            </v-btn>
          </div>
          <div
            class="d-flex flex-wrap justify-center align-center"
            style="gap: 1px; min-width: 200px"
          >
            <v-btn
              color="primary"
              variant="plain"
              @click="addAmount(500)"
              >+500</v-btn
            >
            <v-btn
              color="primary"
              variant="plain"
              @click="addAmount(1000)"
              >+1000</v-btn
            >
            <v-btn
              color="primary"
              variant="plain"
              @click="addAmount(5000)"
              >+5000</v-btn
            >
            <v-btn
              color="primary"
              variant="plain"
              @click="addAmount(10000)"
              >+10000</v-btn
            >
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="secondary"
            variant="plain"
            @click="chargePointDialog = false"
            >취소</v-btn
          >
          <v-btn
            :color="chargeAmount === 0 ? 'secondary' : 'success'"
            variant="plain"
            :disabled="chargeAmount === 0"
            @click="chargePoint"
            >충전</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 구독권 구매 다이얼로그 -->
    <v-dialog
      v-model="buySubscriptionDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">월정액 구독 신청</v-card-title>
        <v-card-text> 월정액 구독을 신청하시겠습니까? </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            @click="buySubscriptionDialog = false"
            >취소</v-btn
          >
          <v-btn
            color="primary"
            @click="buySubscription({ isPurchase: true })"
            >신청</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 구독 해지 다이얼로그 -->
    <v-dialog
      v-model="cancelSubscriptionDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">월정액 구독 해지</v-card-title>
        <v-card-text> 월정액 구독을 해지하시겠습니까? </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            @click="cancelSubscriptionDialog = false"
            >취소</v-btn
          >
          <v-btn
            color="error"
            @click="cancelSubscription"
            >해지</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
      location="top"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios'
import BaseRepository from '@/components/repository/BaseRepository.js'
import { VDataTable } from 'vuetify/labs/VDataTable'

export default {
  name: 'ReaderHome',
  components: {
    VDataTable,
  },
  data() {
    return {
      userId: localStorage.getItem('userId') || null,
      userName: '',
      point: 0,
      isPurchase: false,
      rentedBooks: [],
      loading: false,
      chargePointDialog: false,
      chargeAmount: 0,
      buySubscriptionDialog: false,
      cancelSubscriptionDialog: false,
      headers: [
        { title: '', key: 'coverImage', sortable: false },
        { title: '제목', key: 'title', sortable: true },
        { title: '저자', key: 'author', sortable: true },
        { title: '대여일', key: 'rentedAt', sortable: true },
        { title: '대여만료일', key: 'endAt', sortable: true },
        { title: '', key: 'actions', sortable: false },
      ],
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: 'error',
    }
  },
  async created() {
    this.userRepository = new BaseRepository(axios, 'users')
    this.subscriptionRepository = new BaseRepository(axios, 'subscriptions')
    const storedUserId = localStorage.getItem('userId')
    this.userId = storedUserId ? Number(storedUserId) : null
    if (
      typeof this.userId !== 'number' ||
      isNaN(this.userId) ||
      this.userId === null ||
      localStorage.getItem('userType') !== 'reader'
    ) {
      alert('유효한 독자 정보가 없습니다. 로그인 페이지로 이동합니다.')
      this.$router.push('/login')
      return
    }
    await this.fetchUser()
    await this.fetchPoint()
    await this.fetchRentedBooks()
  },
  methods: {
    async fetchUser() {
      try {
        const user = await this.userRepository.findById(this.userId)
        if (user) {
          this.userName = user.userName
          this.isPurchase = user.isPurchase
        }
      } catch (e) {
        console.error('사용자 정보 조회 실패', e)
        this.isPurchase = false
      }
    },
    async fetchPoint() {
      try {
        const pointResponse = await axios.get(`/points/userId/${String(this.userId)}`)
        this.point = pointResponse.data.point
      } catch (e) {
        console.error('포인트 조회 실패', e)
        this.point = 0
      }
    },
    async fetchRentedBooks() {
      this.loading = true
      try {
        const allSubscriptionsResponse = await axios.get('/subscriptions/search/getSubscription', {
          params: {
            userId: this.userId,
            isSubscription: true,
            id: null,
            startSubscription: null,
            endSubscription: null,
            webUrl: null,
            bookId: null,
          },
        })

        const subscriptions = allSubscriptionsResponse.data._embedded?.subscriptions || []

        const rentedBookPromises = subscriptions.map(async sub => {
          const bookId = sub.bookId?.value
          if (bookId) {
            try {
              const bookDataResponse = await axios.get(`/books/${bookId}`)
              const bookData = bookDataResponse.data
              return {
                id: bookId,
                subscriptionId: sub.id,
                title: bookData.bookName,
                author: bookData.authorName,
                rentedAt: new Date(sub.startSubscription).toLocaleDateString(),
                endAt: new Date(sub.endSubscription).toLocaleDateString(),
                coverImage: 'https://llaestheticstx.com/wp-content/uploads/2024/12/image-placeholder-vertical.jpg', // TODO: Book에 필드 추가?
              }
            } catch (bookError) {
              console.warn(`Failed to fetch book data for ID ${bookId}:`, bookError)
              return null
            }
          }
          return null
        })
        this.rentedBooks = (await Promise.all(rentedBookPromises)).filter(Boolean)
      } catch (e) {
        console.error('대여 도서 목록 조회 실패', e)
        this.rentedBooks = []
      } finally {
        this.loading = false
      }
    },
    async chargePoint() {
      try {
        await axios.post('/points/charge', {
          userId: String(this.userId),
          amount: this.chargeAmount,
        })
        this.chargePointDialog = false
        await this.fetchPoint()
        this.showSuccess('포인트 충전 완료!')
      } catch (e) {
        this.showError('포인트 충전에 실패했습니다.', e)
      }
    },
    // 월정액 구독 TODO: UserController.java의 어노테이션 @PutMapping으로 수정 필요, UserId 타입 때문에 에러
    async buySubscription(val) {
      try {
        await axios.put(`/users/${this.userId}/buysubscription`, {
          isPurchase: val.isPurchase,
        })
        this.buySubscriptionDialog = false
        await this.fetchUser()
        this.showSuccess('월정액 구독 신청 완료!')
      } catch (e) {
        this.showError('월정액 구독 신청에 실패했습니다.', e)
      }
    },
    // 월정액 해지
    async cancelSubscription() {
      try {
        const user = await this.userRepository.findById(this.userId)
        if (user) {
          user.isPurchase = false
          await this.userRepository.save(user, false)
          this.isPurchase = false
        }
        this.cancelSubscriptionDialog = false
        this.showSuccess('월정액 구독 해지 완료!')
      } catch (e) {
        this.showError('월정액 구독 해지에 실패했습니다.', e)
      }
    },
    async deleteBook(item) {
      try {
        const confirmed = confirm(`'${item.title}' 도서를 대여 목록에서 삭제하시겠습니까?`)
        if (!confirmed) return
        if (!item.subscriptionId) {
          this.showError('삭제할 도서의 대여 정보를 찾을 수 없습니다.')
          return
        }
        const subscriptionEntity = await this.subscriptionRepository.findById(item.subscriptionId)
        if (subscriptionEntity && subscriptionEntity._links?.cancelsubscription) {
          await this.subscriptionRepository.invoke(subscriptionEntity, 'cancelsubscription', {})
        } else {
          this.showError('해당 도서의 대여 취소 링크를 찾을 수 없습니다.')
          return
        }
        const index = this.rentedBooks.findIndex(book => book.id === item.id)
        if (index !== -1) {
          this.rentedBooks.splice(index, 1)
        }
        await this.fetchUser()
      } catch (e) {
        this.showError('도서 삭제 중 오류가 발생했습니다.', e)
      }
    },
    addAmount(amount) {
      this.chargeAmount += amount
    },
    resetAmount() {
      this.chargeAmount = 0
    },
    showError(message, error) {
      this.snackbarMessage = message
      this.snackbarColor = 'error'
      this.snackbar = true
      if (error) {
        console.error(message, error)
      } else {
        console.error(message)
      }
    },
    showSuccess(message) {
      this.snackbarMessage = message
      this.snackbarColor = 'success'
      this.snackbar = true
    },
  },
  watch: {
    chargePointDialog(val) {
      if (val) {
        this.chargeAmount = 0
      }
    },
  },
}
</script>
