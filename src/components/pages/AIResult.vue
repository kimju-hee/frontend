<template>
  <v-container>
    <div class="panel">
      <div class="table-responsive">
        <VDataTable
          :headers="headers"
          :items="aiResults"
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
              <td class="whitespace-nowrap">{{ item.manuscriptId }}</td>
              <td class="whitespace-nowrap">{{ item.summary }}</td>
              <td class="whitespace-nowrap">
                <img
                  v-if="item.coverImageUrl"
                  :src="item.coverImageUrl"
                  alt="AI 표지"
                  style="max-width: 120px; max-height: 160px; object-fit: contain"
                />
                <span v-else>이미지 없음</span>
              </td>
              <td class="whitespace-nowrap">{{ formatDate(item.createdAt) }}</td>
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

export default {
  name: 'AIResult',
  components: {
    VDataTable,
  },
  data() {
    return {
      path: 'aiBookGenerations',
      repository: null,
      aiResults: [
        {
          id: 1,
          manuscriptId: 101,
          summary:
            'AI가 생성한 요약문입니다. 이 소설은 주인공의 모험을 다룬 판타지 작품으로, 마법과 용감한 영웅의 이야기를 담고 있습니다.',
          coverImageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788914019424.jpg',
          createdAt: '2024-01-15T10:30:00',
        },
        {
          id: 2,
          manuscriptId: 102,
          summary:
            '로맨스 소설의 AI 요약문입니다. 두 주인공의 사랑 이야기와 그들이 겪는 어려움들을 다룬 감동적인 작품입니다.',
          coverImageUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788930232777.jpg',
          createdAt: '2024-01-16T14:20:00',
        },
      ],
      selectedRow: null,
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: 'error',
      headers: [
        { title: 'ID', key: 'id', sortable: true },
        { title: '원고 ID', key: 'manuscriptId', sortable: true },
        { title: 'AI 요약문', key: 'summary', sortable: false },
        { title: 'AI 표지', key: 'coverImageUrl', sortable: false, width: '120px' },
        { title: '생성일시', key: 'createdAt', sortable: true },
      ],
    }
  },
  async created() {
    this.repository = new BaseRepository(axios, this.path)
    await this.fetchAIResults()
  },
  methods: {
    async fetchAIResults() {
      try {
        this.aiResults = await this.repository.find()
      } catch (e) {
        this.showError('AI 처리 결과 목록을 불러오지 못했습니다.', e)
      }
    },
    changeSelectedRow(item) {
      if (this.selectedRow === item) {
        this.selectedRow = null
      } else {
        this.selectedRow = item
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
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
