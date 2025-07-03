<template>
  <v-container
    fluid
    class="pa-8"
  >
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">{{ authorInfo.authorName }} 작가님, 환영합니다!</h1>
            <div class="d-flex align-center">
              <v-icon
                :icon="authorInfo.isApprove ? 'mdi-check-circle' : 'mdi-clock-outline'"
                :color="authorInfo.isApprove ? 'success' : 'warning'"
                class="mr-2"
              />
              <span :class="authorInfo.isApprove ? 'text-success' : 'text-warning'">
                {{ authorInfo.isApprove ? '승인' : '미승인' }}
              </span>
            </div>
          </div>
          <v-btn
            color="primary"
            size="large"
            @click="showManuscriptDialog = true"
            :disabled="!authorInfo.isApprove"
          >
            <v-icon left>mdi-plus</v-icon>
            새 원고 작성
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 작가 정보 -->
    <v-row class="mb-8">
      <v-col cols="12">
        <div class="position-relative">
          <v-btn
            v-if="!editMode"
            color="secondary"
            variant="plain"
            @click="startEditMode"
            size="small"
            class="position-absolute"
            style="top: 8px; right: 8px; z-index: 1"
          >
            <v-icon
              small
              class="mr-1"
              >mdi-pencil</v-icon
            >
            수정
          </v-btn>
          <v-card elevation="2">
            <v-card-text>
              <v-form
                v-if="editMode"
                @submit.prevent="saveAuthorInfo"
              >
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.email"
                      label="이메일"
                      outlined
                      dense
                      readonly
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.introduction"
                      label="작가 소개"
                      outlined
                      rows="4"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="formData.featuredWorks"
                      label="대표작"
                      outlined
                      rows="2"
                    />
                  </v-col>
                </v-row>
              </v-form>
              <div v-else>
                <v-row>
                  <v-col cols="12">
                    <strong>이메일:</strong>
                    <p class="mt-1">{{ authorInfo.email }}</p>
                  </v-col>
                  <v-col cols="12">
                    <strong>작가 소개:</strong>
                    <p class="mt-1">{{ authorInfo.introduction || '작가 소개가 없습니다.' }}</p>
                  </v-col>
                  <v-col cols="12">
                    <strong>대표작:</strong>
                    <p class="mt-1">{{ authorInfo.featuredWorks || '대표작이 없습니다.' }}</p>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
            <v-card-actions
              v-if="editMode"
              class="justify-end"
            >
              <v-btn
                color="success"
                class="mr-2"
                @click="saveAuthorInfo"
                >저장</v-btn
              >
              <v-btn
                color="secondary"
                @click="cancelEditMode"
                >취소</v-btn
              >
            </v-card-actions>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- 원고 목록 -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="text-h5 font-weight-bold text-left mb-4"> 원고 목록 </v-card-title>
          <v-card-text>
            <VDataTable
              :headers="headers"
              :items="filteredManuscripts"
              :items-per-page="5"
              class="elevation-0"
            >
              <template #item.actions="{ item }">
                <v-btn
                  icon
                  small
                  color="warning"
                  @click="editManuscript(item)"
                  :disabled="!(item.status === 'WRITING' || item.status === 'EDITED')"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="error"
                  @click="deleteManuscript(item)"
                  :disabled="!(item.status === 'WRITING' || item.status === 'EDITED')"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="teal"
                  @click="requestPublish(item)"
                  v-if="item.status === 'EDITED' || item.status === 'REQUESTED' || item.status === 'DONE'"
                  :disabled="item.status !== 'EDITED'"
                >
                  <v-icon>mdi-robot</v-icon>
                </v-btn>
              </template>
              <template #item.status="{ item }">
                <span>{{ formatStatus(item.status) }}</span>
              </template>
              <template #item.updatedAt="{ item }">
                <span>{{ formatDate(item.updatedAt) }}</span>
              </template>
            </VDataTable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 새 원고 등록 다이얼로그 -->
    <v-dialog
      v-model="showManuscriptDialog"
      transition="dialog-bottom-transition"
      max-width="50%"
    >
      <v-card style="min-height: 600px">
        <v-toolbar
          color="primary"
          class="elevation-0 pa-4"
          height="50px"
        >
          <div style="color: white; font-size: 17px; font-weight: 700">새 원고 작성</div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="showManuscriptDialog = false"
          >
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form @submit.prevent="saveManuscript">
          <v-card-text>
            <v-text-field
              v-model="currentManuscript.title"
              placeholder="제목"
              outlined
              dense
              required
            />
            <v-textarea
              v-model="currentManuscript.content"
              placeholder="내용"
              outlined
              rows="16"
              auto-grow
              required
              style="min-height: 300px"
            />
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              text
              @click="showManuscriptDialog = false"
              >취소</v-btn
            >
            <v-btn
              color="primary"
              type="submit"
              >저장</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
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
  name: 'AuthorHome',
  components: {
    VDataTable,
  },
  data() {
    return {
      authorId: null,
      authorInfo: {
        authorName: '',
        isApprove: false,
        email: '',
        introduction: '',
        featuredWorks: '',
      },
      formData: {
        authorName: '',
        isApprove: false,
        email: '',
        introduction: '',
        featuredWorks: '',
      },
      editMode: false,
      manuscripts: [],
      headers: [
        { title: '제목', key: 'title' },
        { title: '최종수정일', key: 'updatedAt' },
        { title: '상태', key: 'status' },
        { title: '', key: 'actions', sortable: false },
      ],
      search: '',
      statusFilter: 'ALL',
      showManuscriptDialog: false,
      currentManuscript: {
        id: null,
        title: '',
        content: '',
        authorId: null,
        status: null,
      },
      manuscriptError: false,
    }
  },
  computed: {
    statusOptions() {
      return [
        { text: '모든 상태', value: 'ALL' },
        { text: '작성 중', value: 'WRITING' },
        { text: '작성 완료', value: 'EDITED' },
        { text: '출간 준비 중', value: 'REQUESTED' },
        { text: '출간 완료', value: 'DONE' },
      ]
    },
    filteredManuscripts() {
      let tempManuscripts = this.manuscripts
      if (this.statusFilter !== 'ALL') {
        tempManuscripts = tempManuscripts.filter(ms => ms.status === this.statusFilter)
      }
      return tempManuscripts
    },
  },
  async created() {
    this.authorRepository = new BaseRepository(axios, 'authors')
    this.manuscriptRepository = new BaseRepository(axios, 'manuscripts')
    this.authorId = localStorage.getItem('userId')
    if (!this.authorId || localStorage.getItem('userType') !== 'author') {
      // alert('유효한 작가 정보가 없습니다. 로그인 페이지로 이동합니다.')
      // this.$router.push('/login')
      return
    }
    await this.fetchAuthorInfo()
    await this.fetchManuscripts()
  },
  methods: {
    // 작가의 정보 불러오기
    async fetchAuthorInfo() {
      try {
        const response = await this.authorRepository.findById(this.authorId)
        if (response) {
          this.authorInfo.authorName = response.authorName
          this.authorInfo.isApprove = response.isApprove
          this.authorInfo.email = response.email
          this.authorInfo.introduction = response.introduction
          this.authorInfo.featuredWorks = response.featuredWorks
          this.formData = {
            authorName: response.authorName,
            isApprove: response.isApprove,
            email: response.email,
            introduction: response.introduction,
            featuredWorks: response.featuredWorks,
          }
        } else {
          // alert('작가 정보를 찾을 수 없습니다.')
          // this.$router.push('/login')
        }
      } catch (error) {
        // alert('작가 정보를 불러오는 중 오류가 발생했습니다.')
        console.error('작가 정보 불러오기 실패:', error)
        // this.$router.push('/login')
      }
    },
    // 작가의 원고 목록 불러오기
    async fetchManuscripts() {
      try {
        const response = await this.manuscriptRepository.find({
          apiPath: 'manuscripts/search/findByAuthorId',
          parameters: { 'authorId.value': this.authorId },
        })
        this.manuscripts = Array.isArray(response) ? response : []
      } catch (error) {
        this.showError('원고 목록을 불러오는 중 오류가 발생했습니다.', error)
        console.error('원고 목록 불러오기 실패:', error)
      }
    },
    startEditMode() {
      this.formData = { ...this.authorInfo }
      this.editMode = true
    },
    cancelEditMode() {
      this.editMode = false
    },
    // 작가의 정보 수정하기
    async saveAuthorInfo() {
      try {
        const payload = {
          id: this.authorId,
          authorName: this.formData.authorName,
          isApprove: this.formData.isApprove,
          email: this.formData.email,
          introduction: this.formData.introduction,
          featuredWorks: this.formData.featuredWorks,
        }
        await this.authorRepository.save(payload, false)
        this.authorInfo = { ...this.formData }
        this.showSuccess('정보 수정 완료!')
        this.editMode = false
        await this.fetchAuthorInfo()
      } catch (error) {
        this.showError('정보 수정에 실패했습니다. 다시 시도해 주세요.', error)
        console.error('작가 정보 수정 실패:', error)
      }
    },
    // 새 원고 작성 다이얼로그 닫기
    closeManuscriptDialog() {
      this.showManuscriptDialog = false
      this.currentManuscript = { id: null, title: '', content: '', authorId: null, status: null }
      this.manuscriptError = false
    },
    // 원고 저장하기
    async saveManuscript() {
      this.manuscriptError = false
      try {
        const payload = {
          title: this.currentManuscript.title,
          content: this.currentManuscript.content,
          authorId: { value: this.authorId },
        }
        const isNew = !this.currentManuscript.id
        if (!isNew) {
          payload.id = this.currentManuscript.id
          payload.status = this.currentManuscript.status
        }
        await this.manuscriptRepository.save(payload, isNew)
        this.showSuccess(isNew ? '원고 작성 완료!' : '원고 수정 완료!')
        this.closeManuscriptDialog()
        await this.fetchManuscripts()
      } catch (error) {
        this.manuscriptError = true
        this.showError('원고 저장/수정에 실패했습니다. 다시 시도해 주세요.', error)
        console.error('원고 저장/수정 실패:', error)
      }
    },
    // 원고 수정하기
    editManuscript(manuscript) {
      this.currentManuscript = { ...manuscript }
      if (this.currentManuscript.authorId && typeof this.currentManuscript.authorId === 'string') {
        this.currentManuscript.authorId = { value: this.currentManuscript.authorId }
      } else if (!this.currentManuscript.authorId) {
        this.currentManuscript.authorId = { value: this.authorId }
      }
      this.showManuscriptDialog = true
    },
    // 원고 삭제하기
    async deleteManuscript(manuscript) {
      if (confirm(`"${manuscript.title}" 원고를 정말 삭제하시겠습니까?`)) {
        try {
          await this.manuscriptRepository.delete(manuscript)
          this.showSuccess('원고 삭제 완료!')
          await this.fetchManuscripts()
        } catch (error) {
          this.showError('원고 삭제에 실패했습니다.', error)
          console.error('원고 삭제 실패:', error)
        }
      }
    },
    // AI 출간 준비 요청하기
    async requestPublish(manuscript) {
      const command = {
        title: manuscript.title,
        content: manuscript.content,
      }
      try {
        await this.manuscriptRepository.invoke(manuscript, 'request-publish', command)
        this.showSuccess(`"${manuscript.title}" 원고 AI 출간 준비 요청 완료!`)
        await this.fetchManuscripts()
      } catch (error) {
        this.showError('AI 출간 준비 요청에 실패했습니다.', error)
        console.error('AI 출간 준비 요청 실패:', error)
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
    formatStatus(status) {
      switch (status) {
        case 'WRITING':
          return '작성 중'
        case 'EDITED':
          return '작성 완료'
        case 'REQUESTED':
          return '출간 준비 중'
        case 'DONE':
          return '출간 완료'
        default:
          return status
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
