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
          <v-card-title class="d-flex justify-space-between align-center">
            <span>대여한 도서 목록</span>
            <v-btn color="primary" variant="outlined" @click="goToBookList">
              <v-icon left class="mr-2">mdi-book-open-variant</v-icon>
              전체 도서 목록 보기
            </v-btn>
          </v-card-title>
          <v-card-text>
            <VDataTable
              :headers="headers"
              :items="rentedBooks"
              :loading="loading"
              class="elevation-0"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon small color="primary" @click="viewBook(item)" class="mr-2">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="deleteBook(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </VDataTable>
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

    <!-- 도서 상세 보기 다이얼로그 -->
    <v-dialog v-model="bookDetailDialog" max-width="800px">
      <v-card>
        <v-toolbar color="primary" class="elevation-0">
          <v-toolbar-title class="text-white">도서 상세 정보</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="bookDetailDialog = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        
        <v-card-text class="pa-6">
          <v-row v-if="selectedBook">
            <v-col cols="12" md="4">
              <v-img
                :src="selectedBook.coverImage || '/placeholder-book.jpg'"
                aspect-ratio="0.7"
                class="rounded-lg"
                cover
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-icon size="64" color="grey">mdi-book-open-page-variant</v-icon>
                  </div>
                </template>
              </v-img>
            </v-col>
            
            <v-col cols="12" md="8">
              <div class="mb-4">
                <h2 class="text-h4 font-weight-bold mb-2">{{ selectedBook.title }}</h2>
                <p class="text-subtitle-1 text-medium-emphasis mb-1">
                  <v-icon size="small" class="mr-1">mdi-account</v-icon>
                  {{ selectedBook.author }}
                </p>
                <p class="text-subtitle-2 text-medium-emphasis">
                  <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                  대여일: {{ selectedBook.rentedAt }}
                </p>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="bookDetailDialog = false">
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios';
import BuySubscription from '../BuySubscription.vue'
import CancelSubscription from '../CancelSubscription.vue'
import { VDataTable } from 'vuetify/labs/VDataTable'

export default {
  name: 'ReaderHome',
  components: { 
    BuySubscription, 
    CancelSubscription,
    VDataTable
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
      chargeAmount: 1000,
      buySubscriptionDialog: false,
      cancelSubscriptionDialog: false,
      bookDetailDialog: false,
      selectedBook: null,
      headers: [
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
      try {
        const userResponse = await axios.get(`/users/${this.userId}`); // userId는 localStorage에서 가져옴
        this.userName = userResponse.data.userName;
        // 필요하다면 email 등 다른 사용자 정보도 저장
      } catch (e) {
        console.error('사용자 정보 조회 실패', e);
        // 에러 처리 (스낵바 등)
      }
    },
    async fetchPoint() {
      try {
        const pointResponse = await axios.get(`/points/userId/${String(this.userId)}`); // userId를 String으로 변환
        this.point = pointResponse.data.point;
      } catch (e) {
        console.error('포인트 조회 실패', e);
        this.point = 0; // 에러 발생 시 0으로 초기화
        // 에러 처리 (스낵바 등)
      }
    },
    async fetchSubscription() {
      try {
        const userResponse = await axios.get(`/users/${this.userId}`);
        this.isPurchase = userResponse.data.isPurchase;
      } catch (e) {
        console.error('구독 여부 조회 실패', e);
        this.isPurchase = false; // 에러 발생 시 미구독으로 설정
        // 에러 처리 (스낵바 등)
      }
    },
    async fetchRentedBooks() {
      this.loading = true;
      try {
        // userId와 isSubscription=true 조건으로 구독 목록 조회
        const subResponse = await axios.get(`/subscriptions/search/getSubscription?userId=${String(this.userId)}&isSubscription=true`);
        
        const activeSubscription = subResponse.data;

        if (activeSubscription) {
          // Subscription 객체에서 bookId와 id(Subscription ID) 추출
          const bookId = activeSubscription.bookId?.value; // BookId는 Embeddable이고 value 필드를 가짐
          const subscriptionId = activeSubscription.id; // Subscription 엔티티의 ID

          this.rentedBooks = [{
            id: bookId, // 책의 ID
            subscriptionId: subscriptionId, // 구독의 ID (해지에 사용)
            title: bookData.bookName,
            author: bookData.authorName,
            rentedAt: new Date(activeSubscription.startSubscription).toLocaleDateString(), // 구독 시작일이 대여일
            coverImage: bookData.coverImageUrl // Book 엔티티에 coverImageUrl 있다면
          }];
        } else {
          this.rentedBooks = [];
        }
      } catch (e) {
        console.error('대여 도서 목록 조회 실패', e);
      } finally {
        this.loading = false;
      }
    },
    async chargePoint() {
      try {
        // chargeAmount가 숫자이고 0보다 큰지 확인
        if (this.chargeAmount <= 0) {
          alert('충전 금액은 0보다 커야 합니다.');
          return;
        }
        await axios.post('/points/charge', {
          userId: String(this.userId), // userId를 String으로 변환
          amount: this.chargeAmount, // amount 필드 사용
        });
        this.chargePointDialog = false;
        await this.fetchPoint(); // 포인트 잔액 갱신
        alert('포인트 충전 요청이 완료되었습니다.');
      } catch (e) {
        console.error('포인트 충전 실패', e);
        alert('포인트 충전에 실패했습니다.');
      }
    },
    async buySubscription(val) { // val은 BuySubscription 컴포넌트에서 emit된 값
      try {
        await axios.put(`/users/${this.userId}/buysubscription`, {
          isPurchase: val.isPurchase // BuySubscription 컴포넌트에서 이 값을 emit할 경우
        });
        this.buySubscriptionDialog = false;
        await this.fetchSubscription(); // 구독 상태 갱신
      } catch (e) {
        console.error('구독 신청 실패', e);
      }
    },
    async cancelSubscription(val) {
      try {
        // 현재 사용자의 활성 월정액 구독을 다시 조회
        const subResponse = await axios.get(`/subscriptions/search/getSubscription?userId=${String(this.userId)}&isSubscription=true`);
        const activeSubscription = subResponse.data;

        if (!activeSubscription || !activeSubscription.id) {
          this.showSnackbar('해지할 활성 구독 정보를 찾을 수 없습니다.', 'warning');
          this.cancelSubscriptionDialog = false;
          return;
        }

        // PUT /subscriptions/{id}/cancelsubscription API 호출
        // CancelSubscriptionCommand는 빈 객체입니다.
        await axios.put(`/subscriptions/${activeSubscription.id}/cancelsubscription`, {});
        
        this.cancelSubscriptionDialog = false;
        await this.fetchSubscription(); // 구독 상태 갱신
        await this.fetchRentedBooks(); // 대여 목록 갱신 (구독 해지 시 목록에서 사라져야 하므로)
        this.showSnackbar('구독 해지가 완료되었습니다.', 'success');
      } catch (e) {
        console.error('구독 해지 실패', e);
        this.showSnackbar('구독 해지에 실패했습니다.', 'error');
      }
    },
    viewBook(item) {
      this.selectedBook = item
      this.bookDetailDialog = true
    },
    async deleteBook(item) {
      try {
        const confirmed = confirm(`'${item.title}' 도서를 대여 목록에서 삭제하시겠습니까?`);
        if (!confirmed) return;

        // 대여 도서 삭제는 해당 `Subscription`을 취소하는 것으로 처리
        // item.subscriptionId는 fetchRentedBooks에서 함께 가져와야 합니다.
        if (!item.subscriptionId) {
          this.showSnackbar('삭제할 도서의 구독 정보를 찾을 수 없습니다.', 'warning');
          return;
        }

        // PUT /subscriptions/{id}/cancelsubscription API 호출
        await axios.put(`/subscriptions/${item.subscriptionId}/cancelsubscription`, {});

        // API 호출 성공 후 프론트엔드 목록에서 제거
        const index = this.rentedBooks.findIndex(book => book.id === item.id);
        if (index !== -1) {
          this.rentedBooks.splice(index, 1);
        }
        await this.fetchSubscription(); // 구독 여부도 다시 확인 (필요시)
      } catch (e) {
        console.error(e);
      }
    },
    goToBookList() {
      this.$router.push('/book-list')
    }
  }
}
</script> 
