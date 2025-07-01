<template>
  <v-container fluid class="pa-8">
    <!-- 인사말 및 유저 정보 -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              {{ userName }}님, 오늘은 어떤 책을 읽을까요?
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
              <v-btn v-if="!isSubscribed" color="primary" @click="subscribeDialog = true">구독 신청</v-btn>
              <v-btn v-else color="error" @click="unsubscribeDialog = true">구독 해지</v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="text-h5 font-weight-bold">
              {{ isSubscribed ? '구독 중' : '미구독' }}
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

    <!-- 구독 신청 다이얼로그 -->
    <v-dialog v-model="subscribeDialog" max-width="400px">
      <v-card>
        <v-card-title>월정액 구독 신청</v-card-title>
        <v-card-text>월정액 구독을 신청하시겠습니까?</v-card-text>
        <v-card-actions>
          <v-btn text @click="subscribeDialog = false">취소</v-btn>
          <v-btn color="primary" @click="subscribe">신청</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 구독 해지 다이얼로그 -->
    <v-dialog v-model="unsubscribeDialog" max-width="400px">
      <v-card>
        <v-card-title>월정액 구독 해지</v-card-title>
        <v-card-text>정말로 구독을 해지하시겠습니까?</v-card-text>
        <v-card-actions>
          <v-btn text @click="unsubscribeDialog = false">취소</v-btn>
          <v-btn color="error" @click="unsubscribe">해지</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ReaderHome',
  data() {
    return {
      userId: localStorage.getItem('userId') || null,
      userName: '',
      point: 0,
      isSubscribed: false,
      rentedBooks: [],
      loadingBooks: false,
      chargePointDialog: false,
      chargeAmount: 1000,
      subscribeDialog: false,
      unsubscribeDialog: false,
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
      this.isSubscribed = false
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
    async subscribe() {
      // TODO: 실제 구독 신청 API 호출
      this.isSubscribed = true
      this.subscribeDialog = false
    },
    async unsubscribe() {
      // TODO: 실제 구독 해지 API 호출
      this.isSubscribed = false
      this.unsubscribeDialog = false
    },
    viewBook(item) {
      // TODO: 도서 상세 보기 구현
      alert(`${item.title} 상세 보기`)
    }
  }
}
</script> 
