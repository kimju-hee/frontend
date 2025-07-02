<template>
  <v-container fluid class="pa-8">
    <!-- 인사말 및 승인 여부 -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              {{ authorInfo.authorName }} 작가님, 환영합니다!
            </h1>
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
          <v-btn color="primary" size="large" @click="showManuscriptDialog = true">
            <v-icon left>mdi-plus</v-icon>
            새 원고 작성
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 작가 정보 -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-text>
            <v-form v-if="editMode" @submit.prevent="saveAuthorInfo">
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
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn color="success" type="submit" class="mr-2">저장</v-btn>
                  <v-btn variant="outlined" @click="cancelEditMode">취소</v-btn>
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
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn color="primary" variant="outlined" @click="startEditMode">수정</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 원고 목록 -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="text-h5 font-weight-bold text-left mb-4">
            원고 목록
          </v-card-title>
          <v-card-text>
            <VDataTable
              :headers="headers"
              :items="filteredManuscripts"
              :items-per-page="5"
              class="elevation-0"
            >
              <template #item.actions="{ item }">
                <v-btn icon small color="primary" @click="viewManuscript(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon small color="warning" @click="editManuscript(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="deleteManuscript(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn icon small color="teal" @click="requestPublish(item)" v-if="item.status === 'EDITED'">
                  <v-icon>mdi-robot</v-icon>
                </v-btn>
              </template>
            </VDataTable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 새 원고 등록 다이얼로그 -->
    <v-dialog v-model="showManuscriptDialog" transition="dialog-bottom-transition" max-width="50%">
      <v-card style="min-height: 600px;">
        <v-toolbar color="primary" class="elevation-0 pa-4" height="50px">
          <div style="color:white; font-size:17px; font-weight:700;">새 원고 작성</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="showManuscriptDialog = false">
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
            <QuillEditor
              v-model="currentManuscript.content"
              style="height:320px"
            />
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="showManuscriptDialog = false">취소</v-btn>
            <v-btn color="primary" type="submit">저장</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import BaseRepository from '@/components/repository/BaseRepository.js'
import axios from '@/plugins/axios'
import { QuillEditor } from 'vue3-quill'
import { VDataTable } from 'vuetify/labs/VDataTable'

export default {
  name: 'AuthorHome',
  components: {
    VDataTable,
    QuillEditor
  },
  data() {
    return {
      authorId: null,
      authorInfo: {
        authorName: '',
        isApprove: false,
        email: '',
        introduction: '',
        featuredWorks: ''
      },
      formData: {
        authorName: '',
        isApprove: false,
        email: '',
        introduction: '',
        featuredWorks: ''
      },
      editMode: false,
      manuscripts: [],
      headers: [
        { title: '제목', key: 'title' },
        { title: '수정일', key: 'updatedAt' },
        { title: '상태', key: 'status' },
        { title: '액션', key: 'actions', sortable: false }
      ],
      search: '',
      statusFilter: 'ALL',
      showManuscriptDialog: false,
      currentManuscript: {
        id: null,
        title: '',
        content: '',
        authorId: null,
        status: null
      },
      manuscriptError: false
    }
  },
  computed: {
    statusOptions() { // TODO: 백엔드랑 상의해서 status 다시 정의하기
      return [
        { text: '모든 상태', value: 'ALL' },
        { text: '작성 중', value: 'WRITING' },
        { text: '작성 완료', value: 'EDITED' },
        { text: '출간 준비 중', value: 'REQUESTED' },
        { text: '출간 완료', value: 'DONE' }
      ]
    },
    filteredManuscripts() {
      let tempManuscripts = this.manuscripts
      if (this.statusFilter !== 'ALL') {
        tempManuscripts = tempManuscripts.filter(ms => ms.status === this.statusFilter)
      }
      return tempManuscripts
    }
  },
  async created() {
    this.authorRepository = new BaseRepository(axios, 'authors')
    this.manuscriptRepository = new BaseRepository(axios, 'manuscripts')
    this.authorId = localStorage.getItem('userId')
    if (!this.authorId || localStorage.getItem('userType') !== 'author') {
      alert('유효한 작가 정보가 없습니다. 로그인 페이지로 이동합니다.')
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
            featuredWorks: response.featuredWorks
          }
        } else {
          alert('작가 정보를 찾을 수 없습니다.')
          // this.$router.push('/login')
        }
      } catch (error) {
        alert('작가 정보를 불러오는 중 오류가 발생했습니다.')
        console.error('작가 정보 불러오기 실패:', error)
        // this.$router.push('/login')
      }
    },

    // 작가의 원고 목록 불러오기
    async fetchManuscripts() {
      try {
        const response = await this.manuscriptRepository.find({
          apiPath: 'manuscripts/search/findByAuthorId',
          parameters: { 'authorId.value': this.authorId }
        })
        this.manuscripts = response
      } catch (error) {
        alert('원고 목록을 불러오는 중 오류가 발생했습니다.')
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
          featuredWorks: this.formData.featuredWorks
        }
        await this.authorRepository.save(payload, false)
        this.authorInfo = { ...this.formData }
        alert('작가 정보가 성공적으로 수정되었습니다.')
        this.editMode = false
        await this.fetchAuthorInfo()
      } catch (error) {
        alert('정보 수정에 실패했습니다. 다시 시도해 주세요.')
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
        const newManuscriptData = {
          title: this.currentManuscript.title,
          content: this.currentManuscript.content,
          authorId: { value: this.authorId }
        }
        await this.manuscriptRepository.save(newManuscriptData, true)
        alert('새 원고가 성공적으로 작성되었습니다.')
        this.closeManuscriptDialog()
        await this.fetchManuscripts()
      } catch (error) {
        this.manuscriptError = true
        console.error('원고 저장/수정 에러:', error)
      }
    },

    // 원고 삭제하기
    async deleteManuscript(manuscript) {
      if (confirm(`"${manuscript.title}" 원고를 정말 삭제하시겠습니까?`)) {
        try {
          await this.manuscriptRepository.delete(manuscript)
          alert('원고가 삭제되었습니다.')
          await this.fetchManuscripts()
        } catch (error) {
          alert('원고 삭제 실패: ' + (error.response?.data?.message || error.message))
          console.error('원고 삭제 에러:', error)
        }
      }
    },

    // AI 출간 준비 요청하기
    async requestPublish(manuscript) {
      const command = {
        title: manuscript.title,
        content: manuscript.content
      }
      try {
        await this.manuscriptRepository.invoke(
          manuscript,
          'requestpublish', // TODO: ManuscriptHateoasProcessor.java에 /requestpublish로 링크 수정 필요
          command
        )
        alert(`"${manuscript.title}" 원고의 AI 출간 준비를 요청했습니다.`)
        await this.fetchManuscripts()
      } catch (error) {
        alert('AI 출간 준비 요청 실패: ' + (error.response?.data?.message || error.message))
        console.error('AI 출간 준비 요청 에러:', error)
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
        minute: '2-digit'
      })
    },

    formatStatus(status) { // TODO: 백엔드랑 상의해서 status 다시 정의하기
      switch (status) {
        case 'WRITING': return '작성 중'
        case 'EDITED': return '작성 완료'
        case 'REQUESTED': return '출간 준비 중'
        case 'DONE': return '출간 완료'
        default: return status
      }
    }
  }
}
</script>
