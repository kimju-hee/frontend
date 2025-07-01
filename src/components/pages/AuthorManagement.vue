<template>
    <v-container>
        <div class="panel">
            <div class="gs-bundle-of-buttons" style="max-height:20vh; margin-bottom: 24px;">
                <v-btn :disabled="!selectedRow" style="margin-left: 5px;" @click="approveAuthorDialog = true" class="contrast-primary-text" small color="primary">
                    <v-icon small class="mr-2">mdi-check-circle-outline</v-icon>작가 승인
                </v-btn>
                <v-dialog v-model="approveAuthorDialog" width="500">
                    <ApproveAuthor
                        :authorName="selectedRow?.authorName"
                        @closeDialog="approveAuthorDialog = false"
                        @approveAuthor="approveAuthor"
                    />
                </v-dialog>
                <v-btn :disabled="!selectedRow" style="margin-left: 5px;" @click="disapproveAuthorDialog = true" class="contrast-primary-text" small color="primary">
                    <v-icon small class="mr-2">mdi-close-circle-outline</v-icon>작가 비승인
                </v-btn>
                <v-dialog v-model="disapproveAuthorDialog" width="500">
                    <DisapproveAuthor
                        :authorName="selectedRow?.authorName"
                        @closeDialog="disapproveAuthorDialog = false"
                        @disapproveAuthor="disapproveAuthor"
                    />
                </v-dialog>
            </div>
            <div class="table-responsive">
                <v-table>
                    <thead>
                        <tr>
                        <th>Id</th>
                        <th>작가명</th>
                        <th>작가 소개</th>
                        <th>대표작</th>
                        <th>Email</th>
                        <th>승인 여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(val, idx) in value" 
                            @click="changeSelectedRow(val)"
                            :key="val._links?.self?.href || idx"  
                            :style="val === selectedRow ? 'background-color: rgb(var(--v-theme-primary), 0.2) !important;':''"
                        >
                            <td class="font-semibold">{{ idx + 1 }}</td>
                            <td class="whitespace-nowrap" label="작가명">{{ val.authorName }}</td>
                            <td class="whitespace-nowrap" label="작가 소개">{{ val.introduction }}</td>
                            <td class="whitespace-nowrap" label="대표작">{{ val.featuredWorks }}</td>
                            <td class="whitespace-nowrap" label="Email">{{ val.email }}</td>
                            <td class="whitespace-nowrap" label="승인 여부">{{ val.isApprove ? '승인' : '미승인' }}</td>
                            <v-row class="ma-0 pa-4 align-center">
                                <v-spacer></v-spacer>
                                <Icon style="cursor: pointer;" icon="mi:delete" @click.stop="deleteRow(val)" />
                            </v-row>
                        </tr>
                    </tbody>
                </v-table>
            </div>
        </div>
    </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import BaseRepository from '@/components/repository/BaseRepository.js';
import ApproveAuthor from '../ApproveAuthor.vue';
import DisapproveAuthor from '../DisapproveAuthor.vue';

export default {
    name: 'AuthorManagement',
    components: {
        ApproveAuthor,
        DisapproveAuthor,
    },
    data() {
        return {
            path: 'authors',
            repository: null,
            value: [],
            selectedRow: null,
            approveAuthorDialog: false,
            disapproveAuthorDialog: false,
        };
    },
    async created() {
        this.repository = new BaseRepository(axios, this.path);
        await this.fetchAuthors();
    },
    methods: {
        async fetchAuthors() {
            try {
                this.value = await this.repository.find();
            } catch (e) {
                // 에러 처리 필요시 여기에 추가
            }
        },
        changeSelectedRow(val) {
            this.selectedRow = val;
        },
        async approveAuthor(params) {
            if (!this.selectedRow) return;
            try {
                const path = 'approveAuthor';
                const temp = await this.repository.invoke(this.selectedRow, path, params);
                this.updateRow(temp.data);
                this.approveAuthorDialog = false;
            } catch (e) {
                // 에러 처리 필요시 여기에 추가
            }
        },
        async disapproveAuthor(params) {
            if (!this.selectedRow) return;
            try {
                const path = 'disapproveAuthor';
                const temp = await this.repository.invoke(this.selectedRow, path, params);
                this.updateRow(temp.data);
                this.disapproveAuthorDialog = false;
            } catch (e) {
                // 에러 처리 필요시 여기에 추가
            }
        },
        async deleteRow(row) {
            if (!row) return;
            try {
                await this.repository.delete(row);
                this.value = this.value.filter(v => v !== row);
                this.selectedRow = null;
                // 성공 처리 필요시 여기에 추가
            } catch (e) {
                // 에러 처리 필요시 여기에 추가
            }
        },
        updateRow(newData) {
            const idx = this.value.findIndex(v => v._links?.self?.href === newData._links?.self?.href);
            if (idx !== -1) {
                this.value[idx] = newData;
            }
        },
    },
};
</script>
