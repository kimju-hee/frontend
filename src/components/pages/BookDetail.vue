<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card v-if="book" elevation="4" class="pa-6">
          <v-row>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
              <v-img :src="book.coverImageUrl" max-width="220" max-height="320" contain />
            </v-col>
            <v-col cols="12" md="8" class="d-flex flex-column justify-center">
              <h2 class="text-h4 font-weight-bold mb-4">{{ book.bookName }}</h2>
              <div class="mb-2"><b>작가:</b> {{ book.authorName }}</div>
              <div class="mb-2"><b>카테고리:</b> {{ book.category }}</div>
              <div class="mb-2"><b>대여료:</b> {{ book.rentalFee || 0 }} P</div>
              <div class="mb-2"><b>베스트셀러:</b> <span v-if="book.isBestSeller">⭐</span><span v-else>아니오</span></div>
            </v-col>
          </v-row>
          <v-divider class="my-6" />
          <div class="mt-4" v-if="book.description">
            <h3 class="text-h6 font-weight-bold mb-2">도서 소개</h3>
            <div style="white-space: pre-line;">{{ book.description }}</div>
          </div>
        </v-card>
        <v-alert v-else type="error" class="mt-8">도서 정보를 불러올 수 없습니다.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios';

export default {
  name: 'BookDetail',
  data() {
    return {
      book: null,
    };
  },
  async created() {
    const bookId = this.$route.params.id;
    try {
      const res = await axios.get(`/books/${bookId}`);
      this.book = res.data;
      // AI 정보(표지, 대여료 등)도 필요하다면 추가 fetch 가능
    } catch (e) {
      this.book = null;
    }
  },
};
</script> 