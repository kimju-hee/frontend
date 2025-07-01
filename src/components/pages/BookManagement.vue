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
            <div class="gs-bundle-of-buttons" style="max-height:20vh; margin-bottom: 24px;">
                <v-btn :disabled="!selectedRow" style="margin-left: 5px;" @click="toggleBestSeller" class="contrast-primary-text" small color="primary">
                    <v-icon small class="mr-2">mdi-star</v-icon>{{ selectedRow && selectedRow.isBestSeller ? '베스트셀러 해제' : '베스트셀러 지정' }}
                </v-btn>
            </div>
            <GetBookById @search="search" style="margin-bottom: 10px; background-color: #ffffff;"></GetBookById>
            <div class="mb-5 text-lg font-bold"></div>
            <div class="table-responsive">
                <v-table>
                    <thead>
                        <tr>
                        <th>Id</th>
                        <th>제목</th>
                        <th>작가</th>
                        <th>카테고리</th>
                        <th>베스트셀러 여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(val, idx) in books" 
                            @click="changeSelectedRow(val)"
                            :key="val.id || idx"  
                            :style="val === selectedRow ? 'background-color: rgb(var(--v-theme-primary), 0.2) !important;':''"
                        >
                            <td class="font-semibold">{{ idx + 1 }}</td>
                            <td class="whitespace-nowrap" label="제목">{{ val.bookName }}</td>
                            <td class="whitespace-nowrap" label="작가">{{ val.authorName }}</td>
                            <td class="whitespace-nowrap" label="카테고리">{{ val.category }}</td>
                            <td class="whitespace-nowrap" label="베스트셀러 여부">{{ val.isBestSeller ? '⭐' : '' }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
        </div>
    </v-container>
</template>

<script>
import axios from '@/plugins/axios';
import BaseRepository from '@/components/repository/BaseRepository.js';
import GetBookById from '../GetBookById.vue';

export default {
    name: 'BookManagement',
    components: { GetBookById },
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
        };
    },
    created() {
        this.repository = new BaseRepository(axios, 'books');
        this.fetchBooks();
    },
    methods: {
        async fetchBooks() {
            try {
                const response = await this.repository.find();
                this.books = response;

            } catch (e) {
                this.showError(e);
            }
        },
        changeSelectedRow(val) {
            this.selectedRow = val;
        },
        async toggleBestSeller() {
            try {
                // 백엔드 API (PUT /books/update-bestseller/{id}) 호출
                // BaseRepository의 invoke 메서드를 사용
                // link는 BookHateoasProcessor에서 정의된 "update-bestseller" 또는 해당 API 엔드포인트 명칭
                // 현재 BookHateoasProcessor는 'update-bestseller' 링크를 직접 추가하지 않으므로,
                // 'BaseRepository'의 invoke 폴백 로직을 사용하거나 'BookHateoasProcessor'에 링크 추가 필요.
                // 임시로 'update-bestseller' 링크명을 사용하여 호출.
                const response = await this.repository.invoke(
                    this.selectedRow,
                    'update-bestseller', 
                    {} 
                );
                
                const updatedBookData = response.data;
                const processedUpdatedBook = updatedBookData;

                const index = this.books.findIndex(book => book.id === processedUpdatedBook.id);
                if (index !== -1) {
                    this.books.splice(index, 1, processedUpdatedBook);
                }
                this.selectedRow = processedUpdatedBook;

                this.snackbar.text = response.data.isBestSeller ? '베스트셀러로 지정되었습니다.' : '베스트셀러가 해제되었습니다.'; //
                this.snackbar.color = 'info';
                this.snackbar.status = true;

            } catch (e) {
                this.showError(e);
            }
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
    },
};
</script>
