<template>
  <v-container fluid class="pa-8">
    <!-- 인사말 및 유저 정보 -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              {{ userName }}님, 환영합니다!
            </h1>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 포인트 및 구독 현황 -->
    <v-row class="mb-8">
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>포인트 현황</span>
            <v-btn color="primary" @click="chargePointDialog = true">충전</v-btn>
          </v-card-title>
          <v-card-text>
            <div class="text-h5 font-weight-bold">{{ point }} P</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>월정액 구독</span>
            <div>
              <v-btn v-if="!isPurchase" color="primary" @click="buySubscriptionDialog = true">구독 신청</v-btn>
              <v-btn v-else color="error" @click="cancelSubscriptionDialog = true">구독 해지</v-btn>
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
          <v-card-title>
            <span>대여한 도서 목록</span>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="bookHeaders"
              :items="rentedBooks"
              :loading="loadingBooks"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon small color="primary" @click="viewBook(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 포인트 충전 다이얼로그 -->
    <v-dialog v-model="chargePointDialog" max-width="400px">
      <v-card>
        <v-card-title>포인트 충전</v-card-title>
        <v-card-text>
          <v-text-field v-model.number="chargeAmount" label="충전 금액" type="number" min="1" />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="chargePointDialog = false">취소</v-btn>
          <v-btn color="primary" @click="chargePoint">충전</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 구독권 구매 다이얼로그 -->
    <v-dialog v-model="buySubscriptionDialog" max-width="400px">
      <BuySubscription
        @closeDialog="buySubscriptionDialog = false"
        @buySubscription="buySubscription"
      />
    </v-dialog>

    <!-- 구독 해지 다이얼로그 -->
    <v-dialog v-model="cancelSubscriptionDialog" max-width="400px">
      <CancelSubscription
        @closeDialog="cancelSubscriptionDialog = false"
        @cancelSubscription="cancelSubscription"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'
import BuySubscription from '../BuySubscription.vue'
import CancelSubscription from '../CancelSubscription.vue'

export default {
  name: 'ReaderHome',
  components: { BuySubscription, CancelSubscription },
  data() {
    return {
      userId: localStorage.getItem('userId') || null,
      userName: '',
      point: 0,
      isPurchase: false,
      rentedBooks: [],
      loadingBooks: false,
      chargePointDialog: false,
      chargeAmount: 1000,
      buySubscriptionDialog: false,
      cancelSubscriptionDialog: false,
      bookHeaders: [
        { title: '제목', key: 'title', sortable: true },
        { title: '저자', key: 'author' },
        { title: '대여일', key: 'rentedAt' },
        { title: '작업', key: 'actions' }
      ]
    }
  },
  async created() {
    await this.fetchUserInfo()
    await this.fetchPoint()
    await this.fetchSubscription()
    await this.fetchRentedBooks()
  },
  methods: {
    async fetchUserInfo() {
      // TODO: 실제 API로 유저 정보 조회
      // 임시
      this.userName = '테스트유저'
    },
    async fetchPoint() {
      // TODO: 실제 API로 포인트 조회
      // 임시
      this.point = 5000
    },
    async fetchSubscription() {
      // TODO: 실제 API로 구독 여부 조회
      // 임시
      this.isPurchase = false
    },
    async fetchRentedBooks() {
      this.loadingBooks = true
      // TODO: 실제 API로 대여 도서 목록 조회
      // 임시
      this.rentedBooks = [
        { title: '예시 도서1', author: '작가1', rentedAt: '2024-06-01' },
        { title: '예시 도서2', author: '작가2', rentedAt: '2024-06-03' }
      ]
      this.loadingBooks = false
    },
    async chargePoint() {
      // TODO: 실제 포인트 충전 API 호출
      this.point += this.chargeAmount
      this.chargePointDialog = false
    },
    async buySubscription(val) {
      // TODO: 실제 구독 신청 API 호출
      this.isPurchase = val.isPurchase
      this.buySubscriptionDialog = false
    },
    async cancelSubscription(val) {
      // TODO: 실제 구독 해지 API 호출
      this.isPurchase = val.isPurchase
      this.cancelSubscriptionDialog = false
    },
    viewBook(item) {
      // TODO: 도서 상세 보기 구현
      alert(`${item.title} 상세 보기`)
    }
  }
}
</script> 
