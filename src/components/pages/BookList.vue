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
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import axios from '@/plugins/axios';
import BaseRepository from '@/components/repository/BaseRepository.js';
import GetBookById from '../GetBookById.vue'

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
        };  
    },
    created() {
        this.repository = new BaseRepository(axios, 'books');
        this.fetchBooks();
    },
    methods:{
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
    }
}
</script> 
