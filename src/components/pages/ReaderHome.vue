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
            <v-btn color="primary" variant="outlined" @click="$router.push('/book-list')">
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
              @click:row="item => $router.push(`/book/${item.id}`)"
            >
              <template #item.coverImage="{ item }">
                <v-img :src="item.coverImage || '/placeholder-book.jpg'" max-width="40" max-height="60" aspect-ratio="1" />
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn icon small color="error" @click.stop="deleteBook(item)">
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
import { VDataTable } from 'vuetify/labs/VDataTable';
import BuySubscription from '../BuySubscription.vue';
import CancelSubscription from '../CancelSubscription.vue';

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
        { title: '표지', key: 'coverImage' },
        { title: '제목', key: 'title', sortable: true },
        { title: '저자', key: 'author' },
        { title: '대여일', key: 'rentedAt' },
        { title: '대여만료일', key: 'endAt' },
        { title: '작업', key: 'actions' }
      ]
    }
  },
  async created() {
    this.userRepository = new BaseRepository(axios, 'users');
    this.subscriptionRepository = new BaseRepository(axios, 'subscriptions');
    await this.fetchUser();
    await this.fetchPoint();
    await this.fetchRentedBooks();
  },
  methods: {
    async fetchUser() {
      try {
        const user = await this.userRepository.findById(this.userId);
        if (user) {
          this.userName = user.userName;
          this.isPurchase = user.isPurchase;
        }
      } catch (e) {
        console.error('사용자 정보 조회 실패', e);
        this.isPurchase = false;
      }
    },
    async fetchPoint() {
      try {
        const pointResponse = await axios.get(`/points/userId/${String(this.userId)}`);
        this.point = pointResponse.data.point;
      } catch (e) {
        console.error('포인트 조회 실패', e);
        this.point = 0;
      }
    },
    async fetchRentedBooks() {
      this.loading = true;
      try {
        const allSubscriptionsResponse = await axios.get(
          '/subscriptions',
          {
            params: {
              'userId.value': String(this.userId),
              'isSubscription': true
            }
          }
        );
        const subscriptions = allSubscriptionsResponse.data._embedded?.subscriptions || [];
        const rentedBookPromises = subscriptions.map(async (sub) => {
          const bookId = sub.bookId?.value;
          if (bookId) {
            try {
              const bookDataResponse = await axios.get(`/books/${bookId}`);
              const bookData = bookDataResponse.data;
              return {
                id: bookId,
                subscriptionId: sub.id,
                title: bookData.bookName,
                author: bookData.authorName,
                rentedAt: new Date(sub.startSubscription).toLocaleDateString(),
                endAt: new Date(sub.endSubscription).toLocaleDateString(),
                coverImage: bookData.coverImageUrl // TODO: Book 엔티티에 이 필드가 있는지 백엔드와 확인 필요
              };
            } catch (bookError) {
              console.warn(`Failed to fetch book data for ID ${bookId}:`, bookError);
              return null;
            }
          }
          return null;
        });
        this.rentedBooks = (await Promise.all(rentedBookPromises)).filter(Boolean);
      } catch (e) {
        console.error('대여 도서 목록 조회 실패', e);
        this.rentedBooks = [];
      } finally {
        this.loading = false;
      }
    },
    async chargePoint() {
      try {
        if (this.chargeAmount <= 0) {
          alert('충전 금액은 0보다 커야 합니다.');
          return;
        }
        await axios.post('/points/charge', {
          userId: String(this.userId),
          amount: this.chargeAmount,
        });
        this.chargePointDialog = false;
        await this.fetchPoint();
        alert('포인트 충전 요청이 완료되었습니다.');
      } catch (e) {
        console.error('포인트 충전 실패', e);
        alert('포인트 충전에 실패했습니다.');
      }
    },
    async buySubscription(val) {
      try {
        await axios.put(`/users/${this.userId}/buysubscription`, {
          isPurchase: val.isPurchase
        });
        this.buySubscriptionDialog = false;
        await this.fetchUser();
      } catch (e) {
        console.error('구독 신청 실패', e);
      }
    },
    // methods 내 cancelSubscription() 함수
    async cancelSubscription() {
        try {
            // TODO: 백엔드와 월정액 구독 해지 API 논의 후 구현
            // 1. User의 isPurchase를 false로 변경하는 API 호출 필요.
            //    예시: await axios.put(`/users/${this.userId}/cancelMonthlySubscription`);
            //    혹은, buySubscription처럼 isPurchase: false를 보내는 API를 백엔드에서 지원한다면:
            //    await axios.put(`/users/${this.userId}/buysubscription`, { isPurchase: false });

            // 현재는 임시로 사용자 isPurchase 상태만 변경하고 알림
            // 백엔드 API가 구현될 때까지 이 부분은 동작하지 않거나 불완전합니다.
            this.isPurchase = false; // 프론트엔드 상태만 임시 변경
            this.cancelSubscriptionDialog = false;
            alert('월정액 구독 해지 요청을 보냈습니다. (백엔드 구현 예정)'); // 임시 알림

            await this.fetchUser(); // User 상태 갱신 (백엔드 API 호출 후)
            // await this.fetchRentedBooks(); // 필요시 대여 목록 갱신 (월정액 해지와 대여 목록은 직접적 연관은 적음)

        } catch (e) {
            console.error('월정액 구독 해지 실패', e);
            // this.showSnackbar('월정액 구독 해지에 실패했습니다.', 'error');
            alert('월정액 구독 해지에 실패했습니다.');
        }
    },
    async deleteBook(item) {
      try {
        const confirmed = confirm(`'${item.title}' 도서를 대여 목록에서 삭제하시겠습니까?`);
        if (!confirmed) return;
        if (!item.subscriptionId) {
          this.showSnackbar('삭제할 도서의 구독 정보를 찾을 수 없습니다.', 'warning');
          return;
        }
        const subscriptionEntity = await this.subscriptionRepository.findById(item.subscriptionId);
        if (subscriptionEntity && subscriptionEntity._links?.cancelsubscription) {
          await this.subscriptionRepository.invoke(subscriptionEntity, 'cancelsubscription', {});
        } else {
          throw new Error("Cancel subscription link not found for book's subscription.");
        }
        const index = this.rentedBooks.findIndex(book => book.id === item.id);
        if (index !== -1) {
          this.rentedBooks.splice(index, 1);
        }
        await this.fetchUser();
      } catch (e) {
        console.error(e);
      }
    },
    showSnackbar(msg, color = 'info') {
      // 필요시 스낵바 구현
    }
  }
}
</script> 
