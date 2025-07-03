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
              v-if="!selectedRow.isApprove"
              style="margin-left: 5px"
              @click="approveAuthorDialog = true"
              class="contrast-primary-text"
              small
              color="primary"
            >
              <v-icon
                small
                class="mr-2"
                >mdi-check-circle-outline</v-icon
              >
              작가 승인
            </v-btn>
            <v-dialog
              v-if="!selectedRow.isApprove"
              v-model="approveAuthorDialog"
              width="500"
            >
              <ApproveAuthor
                :authorName="selectedRow?.authorName"
                @closeDialog="approveAuthorDialog = false"
                @approveAuthor="approveAuthor"
              />
            </v-dialog>

            <v-btn
              v-if="selectedRow.isApprove"
              style="margin-left: 5px"
              @click="disapproveAuthorDialog = true"
              class="contrast-primary-text"
              small
              color="primary"
            >
              <v-icon
                small
                class="mr-2"
                >mdi-close-circle-outline</v-icon
              >
              작가 비승인
            </v-btn>
            <v-dialog
              v-if="selectedRow.isApprove"
              v-model="disapproveAuthorDialog"
              width="500"
            >
              <DisapproveAuthor
                :authorName="selectedRow?.authorName"
                @closeDialog="disapproveAuthorDialog = false"
                @disapproveAuthor="disapproveAuthor"
              />
            </v-dialog>
          </template>
          <template v-else>
            <v-btn style="visibility: hidden; margin-left: 5px">
              <v-icon
                small
                class="mr-2"
                >mdi-check-circle-outline</v-icon
              >
              작가 승인
            </v-btn>
            <v-btn style="visibility: hidden; margin-left: 5px">
              <v-icon
                small
                class="mr-2"
                >mdi-close-circle-outline</v-icon
              >
              작가 비승인
            </v-btn>
          </template>
        </div>
        <div>
          <v-btn
            v-if="selectedRow"
            variant="plain"
            style="margin-left: 8px"
            @click="deleteAuthor(selectedRow)"
            color="secondary"
          >
            <v-icon
              small
              class="mr-2"
              >mdi-delete</v-icon
            >
            작가 삭제
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
            작가 삭제
          </v-btn>
        </div>
      </div>
      <div class="table-responsive">
        <VDataTable
          :headers="headers"
          :items="authors"
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
              <td class="whitespace-nowrap">{{ item.authorName }}</td>
              <td class="whitespace-nowrap">{{ item.introduction }}</td>
              <td class="whitespace-nowrap">{{ item.featuredWorks }}</td>
              <td class="whitespace-nowrap">{{ item.email }}</td>
              <td class="whitespace-nowrap">{{ item.isApprove ? '⭕' : '❌' }}</td>
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
import ApproveAuthor from '../ApproveAuthor.vue'
import DisapproveAuthor from '../DisapproveAuthor.vue'

export default {
  name: 'AuthorManagement',
  components: {
    ApproveAuthor,
    DisapproveAuthor,
    VDataTable,
  },
  data() {
    return {
      path: 'authors',
      repository: null,
      authors: [
        {
          id: 11,
          authorName: '홍길동',
          introduction: '테스트용 작가입니다.',
          featuredWorks: '가짜 소설',
          email: 'hong-a@test.com',
          isApprove: false,
          _links: { self: { href: 'dummy/1' } },
        },
      ],
      selectedRow: null,
      approveAuthorDialog: false,
      disapproveAuthorDialog: false,
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: 'error',
      headers: [
        { title: 'ID', key: 'id', sortable: true },
        { title: '작가명', key: 'authorName', sortable: true },
        { title: '소개말', key: 'introduction', sortable: false },
        { title: '대표작', key: 'featuredWorks', sortable: false },
        { title: 'Email', key: 'email', sortable: false },
        { title: '승인 여부', key: 'isApprove', sortable: true },
      ],
    }
  },
  async created() {
    this.repository = new BaseRepository(axios, this.path)
    if (localStorage.getItem('userType') !== 'admin') {
      alert('잘못된 접근입니다. 로그인 페이지로 이동합니다.')
      this.$router.push('/login')
      return
    }
    await this.fetchAuthors()
  },
  methods: {
    async fetchAuthors() {
      try {
        this.authors = await this.repository.find()
      } catch (e) {
        this.showError('작가 목록을 불러오지 못했습니다.', e)
      }
    },
    changeSelectedRow(item) {
      if (this.selectedRow === item) {
        this.selectedRow = null
      } else {
        this.selectedRow = item
      }
    },
    async approveAuthor(params) {
      if (!this.selectedRow) return
      try {
        const path = 'approveauthor'
        const temp = await this.repository.invoke(this.selectedRow, path, params)
        this.updateRow(temp.data)
        this.approveAuthorDialog = false
        this.selectedRow = null
        this.showSuccess('작가 승인 완료!')
      } catch (e) {
        this.showError('작가 승인에 실패했습니다.', e)
      }
    },
    async disapproveAuthor(params) {
      if (!this.selectedRow) return
      try {
        const path = 'disapproveauthor'
        const temp = await this.repository.invoke(this.selectedRow, path, params)
        this.updateRow(temp.data)
        this.disapproveAuthorDialog = false
        this.selectedRow = null
        this.showSuccess('작가 비승인 완료!')
      } catch (e) {
        this.showError('작가 비승인에 실패했습니다.', e)
      }
    },
    async deleteAuthor(row) {
      if (!row) return
      try {
        await this.repository.delete(row)
        this.authors = this.authors.filter(v => v !== row)
        this.selectedRow = null
        this.showSuccess('삭제 완료!')
      } catch (e) {
        this.showError('삭제에 실패했습니다.', e)
      }
    },
    updateRow(newData) {
      const idx = this.authors.findIndex(v => v._links?.self?.href === newData._links?.self?.href)
      if (idx !== -1) {
        this.authors[idx] = newData
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
