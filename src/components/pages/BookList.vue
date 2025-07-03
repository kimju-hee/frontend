<template>
  <v-container>
    <div class="panel">
      <GetBookById
        @search="search"
        style="margin-bottom: 10px; background-color: #ffffff"
      ></GetBookById>
      <div class="table-responsive">
        <VDataTable
          :headers="headers"
          :items="books"
          item-key="id"
          :items-per-page="10"
          class="elevation-1"
          @click:row="changeSelectedRow"
        >
          <template #item="{ item }">
            <tr
              :class="{ 'selected-row-class': item === selectedRow }"
              @click="changeSelectedRow(item)"
            >
              <td class="font-semibold">{{ item.id }}</td>
              <td class="whitespace-nowrap">
                <img
                  v-if="item.coverImageUrl"
                  :src="item.coverImageUrl"
                  alt="표지"
                  style="width: 120px; height: 160px; object-fit: cover"
                />
                <span v-else>이미지 없음</span>
              </td>
              <td class="whitespace-nowrap">{{ item.bookName }}</td>
              <td class="whitespace-nowrap">{{ item.authorName }}</td>
              <td class="whitespace-nowrap">{{ item.category }}</td>
              <td class="whitespace-nowrap">{{ item.subscriptionFee }}</td>
              <td class="whitespace-nowrap">{{ item.isBestSeller ? '⭐' : '' }}</td>
            </tr>
          </template>
        </VDataTable>
      </div>
    </div>
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
import BaseRepository from '@/components/repository/BaseRepository.js'
import axios from '@/plugins/axios'
import { VDataTable } from 'vuetify/labs/VDataTable'
import GetBookById from '../GetBookById.vue'

export default {
  name: 'BookList',
  components: { GetBookById, VDataTable },
  data() {
    return {
      path: 'books',
      repository: null,
      books: [
        {
          id: 1,
          bookName: '마법사의 모험',
          authorName: '김작가',
          category: '판타지',
          subscriptionFee: 1000,
          isBestSeller: true,
          coverImageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/480D181120260.jpg',
        },
      ],
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: 'error',
      headers: [
        { title: 'ID', key: 'id', sortable: true },
        { title: '', key: 'coverImageUrl', sortable: false, width: '120px' },
        { title: '제목', key: 'bookName', sortable: true },
        { title: '작가', key: 'authorName', sortable: true },
        { title: '카테고리', key: 'category', sortable: true },
        { title: '포인트', key: 'subscriptionFee', sortable: true },
        { title: '베스트셀러', key: 'isBestSeller', sortable: true },
      ],
      showRentDialog: false,
      bookToRent: null,
      userId: null,
      userPointInfo: null,
    }
  },
  created() {
    this.repository = new BaseRepository(axios, this.path)
    this.userId = localStorage.getItem('userId')
    if (!this.userId || localStorage.getItem('userType') !== 'reader') {
      alert('유효한 독자 정보가 없습니다. 로그인 페이지로 이동합니다.')
      this.$router.push('/login')
      return
    }
    this.fetchUserPointInfo()
    this.fetchBooks()
  },
  methods: {
    async fetchBooks() {
      try {
        this.books = await this.repository.find()
      } catch (e) {
        this.showError('도서 목록을 불러오지 못했습니다.', e)
      }
    },

    async fetchUserPointInfo() {
      try {
        const response = await axios.get(`/points/userId/${this.userId}`)
        this.userPointInfo = response.data
      } catch (e) {
        this.showError('사용자 포인트 정보 불러오기 실패:', e)
        this.userPointInfo = { point: 0, isSubscribe: false }
      }
    },
    changeSelectedRow(val) {
      this.selectedRow = val
    },
    async search(query) {
      try {
        const response = await this.repository.find(query)
        this.books = response
      } catch (e) {
        this.showError('검색에 실패했습니다.', e)
      }
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
    async goToBookDetail(val) {
      try {
        if (this.userPointInfo.isSubscribe) {
          this.showSuccess('월정액 구독 중이므로 바로 열람합니다!')
          this.$router.push(`/book/${val.id}`)
        } else {
          this.bookToRent = val
          this.showRentDialog = true
        }
      } catch (e) {
        this.showError(e)
      }
    },
    async rentBook() {
      try {
        const deductPayload = {
          userId: this.String(this.userId),
          amount: this.bookToRent.rentalFee, // 책의 대여료만큼 차감
        }
        await axios.post('/points/deduct', deductPayload)

        const subscriptionPayload = {
          userId: { value: this.userId },
          bookId: { value: this.bookToRent.id },
          isSubscription: true,
          startSubscription: new Date(),
        }
        await axios.post('/subscriptions', subscriptionPayload) // Subscription 생성

        this.showRentDialog = false
        this.showSuccess(`'${this.bookToRent.bookName}' 도서를 대여했습니다!`)
        this.$router.push(`/book/${this.bookToRent.id}`)
        await this.fetchUserPointInfo()
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message === `Not enough points for user: ${this.userId}`) {
          this.showError('포인트가 부족합니다. 포인트를 충전해주세요.', e)
        } else {
          this.showError('도서 대여에 실패했습니다. 다시 시도해주세요.', e)
        }
      }
    },
  },
}
</script>
