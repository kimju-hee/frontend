<template>
    <v-container>
        <v-snackbar
            v-model="snackbar.status"
            :timeout="snackbar.timeout"
            :color="snackbar.color"
        >
            <v-btn style="margin-left: 80px;" text @click="snackbar.status = false">
                Close
            </v-btn>
        </v-snackbar>
        <div class="panel">
            <div class="mb-5 text-h5 font-weight-bold">전체 도서</div>
            <GetBookById @search="search" style="margin-bottom: 10px; background-color: #ffffff;"></GetBookById>
            <div class="mb-5 text-lg font-bold"></div>
            <div class="table-responsive">
                <v-table>
                    <thead>
                        <tr>
                        <th>Id</th>
                        <th>도서명</th>
                        <th>작가명</th>
                        <th>카테고리</th>
                        <th>베스트셀러 여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(val, idx) in value" 
                            @click="changeSelectedRow(val)"
                            :key="val"  
                            :style="val === selectedRow ? 'background-color: rgb(var(--v-theme-primary), 0.2) !important;':''"
                        >
                            <td class="font-semibold">{{ idx + 1 }}</td>
                            <td class="whitespace-nowrap" label="도서명">{{ val.bookName }}</td>
                            <td class="whitespace-nowrap" label="작가명">{{ val.authorName }}</td>
                            <td class="whitespace-nowrap" label="카테고리">{{ val.category }}</td>
                            <td class="whitespace-nowrap" label="베스트셀러 여부">{{ val.isBestSeller }}</td>
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
import BaseGrid from '../base-ui/BaseGrid.vue'
import GetBookById from '../GetBookById.vue'

export default {
    name: 'bookList',
    mixins:[BaseGrid],
    components:{ GetBookById },
    data: () => ({
        path: 'books',
    }),
    watch: {
    },
    methods:{
    }
}
</script> 
