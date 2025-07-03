<template>
    <v-container>
        <v-snackbar
            v-model="snackbar.status"
            :timeout="snackbar.timeout"
            :color="snackbar.color"
        >
            {{ snackbar.text }}
            <v-btn style="margin-left: 80px;" text @click="snackbar.status = false">
                Close
            </v-btn>
        </v-snackbar>
        <div class="panel">
            <div class="mb-5 text-h5 font-weight-bold">전체 도서 목록</div>
            <GetBookById @search="search" style="margin-bottom: 10px; background-color: #ffffff;"></GetBookById>
            <div class="mb-5 text-lg font-bold"></div>
            <div class="table-responsive">
                <v-table>
                    <thead>
                        <tr>
                        <th>Id</th>
                        <th></th>
                        <th>제목</th>
                        <th>작가</th>
                        <th>카테고리</th>
                        <th>대여 포인트</th>
                        <th>베스트셀러 여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(val, idx) in booksWithAiInfo" 
                            @click="goToBookDetail(val)"
                            :key="val.id || idx"  
                            :style="val === selectedRow ? 'background-color: rgb(var(--v-theme-primary), 0.2) !important;':''"
                        >
                            <td class="font-semibold">{{ val.id }}</td>
                            <td><v-img :src="val.coverImageUrl" aspect-ratio="1" max-height="60px" max-width="40px"></v-img></td>
                            <td class="whitespace-nowrap" label="제목">{{ val.bookName }}</td>
                            <td class="whitespace-nowrap" label="작가">{{ val.authorName }}</td>
                            <td class="whitespace-nowrap" label="카테고리">{{ val.category }}</td>
                            <td class="whitespace-nowrap" label="대여료">{{ val.rentalFee || 0 }} P</td>
                            <td class="whitespace-nowrap" label="베스트셀러 여부">{{ val.isBestSeller ? '⭐' : '' }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
        </div>
        <v-dialog v-model="showRentDialog" max-width="400">
          <v-card>
            <v-card-title>도서 대여</v-card-title>
            <v-card-text>
              이 도서는 대여가 필요합니다.<br />
              보유 포인트: {{ userPointInfo.point }} P<br />
              대여료: {{ bookToRent.rentalFee }} P<br />
              포인트를 차감하고 대여하시겠습니까?
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="showRentDialog = false">취소</v-btn>
              <v-btn color="primary" text @click="rentBook"
                        :disabled="userPointInfo && bookToRent && userPointInfo.point < bookToRent.rentalFee">
                    대여하기
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import BaseRepository from '@/components/repository/BaseRepository.js';
import axios from '@/plugins/axios';
import GetBookById from '../GetBookById.vue';

export default {
    name: 'BookList',
    components:{ GetBookById },
    data() {
        return {
            path: '/books',
            repository: null,
            books: [],
            selectedRow: null,
            snackbar: {
                status: false,
                timeout: 5000,
                text: '',
                color: 'info',
            },
            showRentDialog: false,
            bookToRent: null,
            userId: null,
            userPointInfo: null,
            aiBookGenRepository: null,
            aiBookGenerations: {},
        };  
    },
    computed: {
        booksWithAiInfo() {
            return this.books.map(book => {
                const aiGenInfo = this.aiBookGenerations[book.manuscriptId]; // manuscriptId로 AI 정보 가져오기
                return {
                    ...book,
                    coverImageUrl: aiGenInfo ? aiGenInfo.coverImageUrl : 'path/to/default_image.jpg', // 기본 이미지 설정
                    rentalFee: aiGenInfo ? aiGenInfo.subscriptionFee : 0, // AI 책정 대여료, 없으면 0
                };
            });
        }
    },
    created() {
        this.repository = new BaseRepository(axios, 'books');
        this.aiBookGenRepository = new BaseRepository(axios, 'aiBookGenerations');
        this.userId = localStorage.getItem('userId');
        if (!this.userId || localStorage.getItem('userType') !== 'reader') { 
            // alert('유효한 독자 정보가 없습니다. 로그인 페이지로 이동합니다.');
            // this.$router.push('/login');
            return;
        }
        this.fetchUserPointInfo();
        this.fetchBooks();
    },
    methods:{
        async fetchBooks() {
            try {
                const booksResponse = await this.repository.find();
                this.books = booksResponse;

                // 각 책에 대한 AiBookGeneration 정보 가져오기
                const fetchAiGenPromises = this.books.map(async book => {
                    // Book 엔티티에 manuscriptId가 있다고 가정 (만약 없다면 백엔드 Book 엔티티에 추가해야 함)
                    // 현재 Book.java에 manuscriptId 필드가 없으므로, AI로 생성된 책임을 식별할 다른 방법이 필요.
                    // 가장 간단한 방법은 Book 엔티티에 manuscriptId 필드를 추가하는 것 (백엔드 수정 발생).
                    // 만약 Book 엔티티에 manuscriptId가 없다면, 다른 방식으로 AiBookGeneration을 찾아야 합니다.
                    // 예: BookName에서 파싱하거나, AiBookGeneration의 findByBookId 같은 쿼리 필요.

                    // 현재 Book.java에는 manuscriptId 필드가 없습니다.
                    // Book.java의 registerBook 메서드는 BookName을 "신규 도서_" + manuscriptId 로 설정합니다.
                    // 이걸 역으로 이용하거나, Book 엔티티에 manuscriptId 필드를 추가하는 것이 가장 현실적입니다.
                    // 백엔드 수정 최소화 원칙에 따라, Book.java에 manuscriptId 필드가 없다는 것을 전제로 하겠습니다.
                    // 그렇다면, AiBookGeneration 엔티티를 모두 가져와서 Book.id와 연결하거나,
                    // Book의 authorName이 "AI Writer"인 경우에만 AiBookGeneration을 검색하는 등 복잡해집니다.

                    // 여기서는 Book 엔티티에 'manuscriptId' 필드가 있다고 가정하고 진행하겠습니다.
                    // (만약 없다면 백엔드에 'private Long manuscriptId;' 추가해야 합니다.)
                    if (book.manuscriptId) { // Book 엔티티에 manuscriptId가 있다고 가정
                        try {
                            // AiBookGenerationRepository에 findByManuscriptId 쿼리가 있다고 가정
                            // (AiBookGeneration.java의 generateBookSummary 등에서 findByManuscriptId 사용됨)
                            const aiGenData = await this.aiBookGenRepository.find({
                                apiPath: `aiBookGenerations/search/findByManuscriptId`,
                                parameters: { manuscriptId: book.manuscriptId }
                            });
                            if (aiGenData && aiGenData.length > 0) {
                                // 첫 번째 결과 (일반적으로 manuscriptId당 하나)를 사용
                                this.$set(this.aiBookGenerations, book.manuscriptId, aiGenData[0]);
                            }
                        } catch (aiGenError) {
                            console.warn(`AiBookGeneration for manuscriptId ${book.manuscriptId} not found or error:`, aiGenError);
                            // 해당 AI 생성 정보가 없는 경우 스킵
                        }
                    }
                });
                await Promise.all(fetchAiGenPromises); // 모든 AI 정보 조회 완료 대기

            } catch (e) {
                this.showError(e);
            }
        },
        async fetchUserPointInfo() {
            try {
                const response = await axios.get(`/points/userId/${this.userId}`);
                this.userPointInfo = response.data; 
            } catch (e) {
                this.showError(e);
                console.error('사용자 포인트 정보 불러오기 실패:', e);
                this.userPointInfo = { point: 0, isSubscribe: false }; 
            }
        },
        changeSelectedRow(val) {
            this.selectedRow = val;
        },
        async search(query) {
            try {
                const response = await this.repository.find(query);
                this.books = response;
            } catch (e) {
                this.showError(e);
            }
        },
        showError(e) {
            this.snackbar.status = true;
            this.snackbar.color = 'error';
            if (e.response && e.response.data && e.response.data.message) {
                this.snackbar.text = e.response.data.message;
            } else {
                this.snackbar.text = e.message || e;
            }
        },
        async goToBookDetail(val) {
            try {
                if (this.userPointInfo.isSubscribe) {
                    this.snackbar.text = '월정액 구독 중이므로 바로 열람합니다!';
                    this.snackbar.color = 'success';
                    this.snackbar.status = true;
                    this.$router.push(`/book/${val.id}`);
                } else {
                    this.bookToRent = val;
                    this.showRentDialog = true;
                }
            } catch (e) {
                this.showError(e);
            }
        },
        async rentBook() {
            try {
                const deductPayload = {
                    userId: this.userId,
                    amount: this.bookToRent.rentalFee, // 책의 대여료만큼 차감
                };
                await axios.post('/points/deduct', deductPayload);

                const subscriptionPayload = {
                    userId: { value: this.userId },
                    bookId: { value: this.bookToRent.id },
                    isSubscription: true,
                    startSubscription: new Date(),
                    // 1주일 (1000ms * 60s * 60min * 24hr * 7days)
                    endSubscription: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
                    // webUrl: `/book/${this.bookToRent.id}`, // 필요시 추가
                };
                await axios.post('/subscriptions', subscriptionPayload); // Subscription 생성

                this.showRentDialog = false;
                this.snackbar.text = `'${this.bookToRent.bookName}' 도서를 대여했습니다!`;
                this.snackbar.color = 'success';
                this.snackbar.status = true;
                this.$router.push(`/book/${this.bookToRent.id}`); // 상세 페이지로 이동
                await this.fetchUserPointInfo(); // 포인트 잔액 새로고침

            } catch (e) {
                this.showError(e);
                console.error('도서 대여 실패:', e);
                // 포인트 부족 등의 에러 메시지 상세화
                if (e.response && e.response.data && e.response.data.message === `Not enough points for user: ${this.userId}`) {
                    this.snackbar.text = '포인트가 부족합니다. 포인트를 충전해주세요.';
                    this.snackbar.color = 'warning';
                    this.snackbar.status = true;
                } else {
                    this.snackbar.text = '도서 대여에 실패했습니다. 다시 시도해주세요.';
                    this.snackbar.color = 'error';
                    this.snackbar.status = true;
                }
            }
        },
    }
}
</script> 
