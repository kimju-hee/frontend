<template>
  <v-container>
    <div class="panel">
      <div
        class="gs-bundle-of-buttons"
        style="
          max-height: 20vh;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div>
          <template v-if="selectedRow">
            <v-btn
              v-if="!selectedRow.isBestSeller"
              style="margin-left: 5px"
              @click="toggleBestSeller"
              class="contrast-primary-text"
              small
              color="primary"
              disabled
            >
              <v-icon
                small
                class="mr-2"
                >mdi-star</v-icon
              >
              베스트셀러 지정
            </v-btn>
            <v-btn
              v-if="selectedRow.isBestSeller"
              style="margin-left: 5px"
              @click="toggleBestSeller"
              class="contrast-primary-text"
              small
              color="primary"
              disabled
            >
              <v-icon
                small
                class="mr-2"
                >mdi-star</v-icon
              >
              베스트셀러 해제
            </v-btn>
          </template>
          <template v-else>
            <v-btn style="visibility: hidden; margin-left: 5px">
              <v-icon
                small
                class="mr-2"
                >mdi-star</v-icon
              >
              베스트셀러 지정
            </v-btn>
            <v-btn style="visibility: hidden; margin-left: 5px">
              <v-icon
                small
                class="mr-2"
                >mdi-star</v-icon
              >
              베스트셀러 해제
            </v-btn>
          </template>
        </div>
        <div>
          <v-btn
            v-if="selectedRow"
            variant="plain"
            style="margin-left: 8px"
            @click="deleteBook(selectedRow)"
            color="secondary"
          >
            <v-icon
              small
              class="mr-2"
              >mdi-delete</v-icon
            >
            도서 삭제
          </v-btn>
          <v-btn
            v-else
            variant="plain"
            style="visibility: hidden; margin-left: 8px"
            color="secondary"
          >
            <v-icon
              small
              class="mr-2"
              >mdi-delete</v-icon
            >
            도서 삭제
          </v-btn>
        </div>
      </div>
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
  name: 'BookManagement',
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
        {
          id: 2,
          bookName: '사랑의 계절',
          authorName: '이작가',
          category: '로맨스',
          subscriptionFee: 800,
          isBestSeller: false,
          coverImageUrl: 'https://image.aladin.co.kr/product/16940/16/cover500/k322534377_1.jpg',
        },
        {
          id: 3,
          bookName: '미스터리 살인사건',
          authorName: '박작가',
          category: '추리',
          subscriptionFee: 1200,
          isBestSeller: true,
          coverImageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791189437435.jpg',
        },
      ],
      selectedRow: null,
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
    }
  },
  created() {
    this.repository = new BaseRepository(axios, this.path)
    if (localStorage.getItem('userType') !== 'admin') {
      alert('잘못된 접근입니다. 로그인 페이지로 이동합니다.')
      this.$router.push('/login')
      return
    }
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
    changeSelectedRow(item) {
      if (this.selectedRow === item) {
        this.selectedRow = null
      } else {
        this.selectedRow = item
      }
    },
    async toggleBestSeller() {
      if (this.selectedRow.isBestSeller) {
        try {
          // 구현 필요
          this.selectedRow = null
          this.showSuccess('베스트셀러 해제 완료!')
        } catch (e) {
          this.showError('베스트셀러 해제에 실패했습니다.', e)
        }
      } else {
        try {
          // 구현 필요
          this.selectedRow = null
          this.showSuccess('베스트셀러 지정 완료!')
        } catch (e) {
          this.showError('베스트셀러 지정에 실패했습니다.', e)
        }
      }
    },
    async search(query) {
      try {
        const response = await this.repository.find(query)
        this.books = response
      } catch (e) {
        this.showError('검색에 실패했습니다.', e)
      }
    },
    async deleteBook(row) {
      if (!row) return
      try {
        await this.repository.delete(row)
        this.books = this.books.filter(v => v !== row)
        this.selectedRow = null
        this.showSuccess('삭제 완료!')
      } catch (e) {
        this.showError('삭제에 실패했습니다.', e)
      }
    },
    updateRow(newData) {
      const idx = this.books.findIndex(v => v._links?.self?.href === newData._links?.self?.href)
      if (idx !== -1) {
        this.books[idx] = newData
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
  },
}
</script>

<style scoped>
.selected-row-class {
  background-color: rgb(var(--v-theme-primary), 0.1) !important;
}
</style>
