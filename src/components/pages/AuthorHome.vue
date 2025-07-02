<template>
  <v-container fluid class="pa-8">
    <!-- 인사말 및 승인 여부 -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              {{ authorName }} 작가님, 환영합니다!
            </h1>
            <div class="d-flex align-center">
              <v-icon 
                :icon="isApprove ? 'mdi-check-circle' : 'mdi-clock-outline'" 
                :color="isApprove ? 'success' : 'warning'"
                class="mr-2"
              />
              <span :class="isApprove ? 'text-success' : 'text-warning'">
                {{ isApprove ? '승인' : '미승인' }}
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
          <v-card-title class="d-flex justify-space-between align-center">
            <span>작가 정보</span>
            <v-btn color="primary" variant="outlined" v-if="!editMode" @click="editMode = true">
              수정
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form v-if="editMode" @submit.prevent="saveAuthorInfo">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="authorInfo.email" label="이메일" outlined dense required />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="authorInfo.bio" label="작가 소개" outlined rows="4" />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="authorInfo.works" label="대표작" outlined rows="2" />
                </v-col>
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn color="success" type="submit" class="mr-2">저장</v-btn>
                  <v-btn variant="outlined" @click="editMode = false">취소</v-btn>
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
                  <p class="mt-1">{{ authorInfo.bio || '작가 소개가 없습니다.' }}</p>
                </v-col>
                <v-col cols="12">
                  <strong>대표작:</strong>
                  <p class="mt-1">{{ authorInfo.works || '대표작이 없습니다.' }}</p>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 작품 목록 -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>
            <span>작품 목록</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <VDataTable
              :headers="headers"
              :items="manuscripts"
              :items-per-page="5"
              :loading="loading"
              class="elevation-0"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon small color="primary" @click="viewManuscript(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon small color="warning" @click="editManuscript(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small color="error" @click="deleteManuscript(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn icon small color="teal" @click="requestAiAutomation(item)" v-if="item.status === '원고 작성됨'">
                  <v-icon>mdi-robot</v-icon>
                </v-btn>
                <v-btn icon small color="indigo" @click="requestPublication(item)" v-if="item.status === '출간 준비됨'">
                  <v-icon>mdi-send</v-icon>
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
        <v-form @submit.prevent="onAddManuscript">
          <v-card-text>
            <v-text-field v-model="newManuscript.title" placeholder="제목" outlined dense required />
            <v-textarea
              v-model="newManuscript.content"
              placeholder="내용"
              outlined
              rows="16"
              auto-grow
              required
              style="min-height: 300px;"
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
import axios from '@/plugins/axios';
import BaseRepository from '@/components/repository/BaseRepository.js';
import { VDataTable } from 'vuetify/labs/VDataTable'

export default {
  name: 'AuthorHome',
  components: {
    VDataTable,
  },
  data() {
    return {
      authorId: localStorage.getItem('userId') || null,
      author: null,
      repository: null,
      authorName: '',
      isApprove: false,
      authorInfo: {
        email: '',
        bio: '',
        works: ''
      },
      editMode: false,
      manuscripts: [],
      showManuscriptDialog: false,
      newManuscript: {
        title: '',
        content: ''
      },
      headers: [
        { title: '제목', key: 'title', sortable: true },
        { title: '내용', key: 'content' },
        { title: '상태', key: 'status' },
        { title: '작업', key: 'actions' }
      ],
      loading: false
    }
  },
  async created() {
    this.repository = new BaseRepository(axios, 'authors')
    await this.fetchAuthorInfo()
    await this.fetchManuscripts()
  },
  methods: {
    async fetchAuthorInfo() {
      try {
        const author = await this.repository.findById(this.authorId)
        this.author = author
        this.authorName = author.authorName
        this.isApprove = author.isApprove
        this.authorInfo.email = author.email
        this.authorInfo.bio = author.introduction
        this.authorInfo.works = author.featuredWorks
      } catch (e) {
        console.error('작가 정보 조회 실패', e)
      }
    },
    async fetchManuscripts() {
      try {
        this.loading = true
        const link = this.author?._links?.manuscripts?.href
        if (!link) throw new Error('manuscripts 링크 없음')
        const res = await axios.get(link)
        this.manuscripts = res.data._embedded?.manuscripts || []
      } catch (e) {
        console.error('원고 목록 조회 실패', e)
      } finally {
        this.loading = false
      }
    },
    async onAddManuscript() {
      try {
        const authorHref = this.author?._links?.self?.href
        if (!authorHref) throw new Error('author self 링크 없음')

        await axios.post('/manuscripts', {
          title: this.newManuscript.title,
          content: this.newManuscript.content,
          status: '원고 작성됨',
          authorId: authorHref
        })

        this.newManuscript = { title: '', content: '' }
        this.showManuscriptDialog = false
        await this.fetchManuscripts()
      } catch (e) {
        alert('원고 등록 실패')
        console.error(e)
      }
    },
    async saveAuthorInfo() {
      try {
        const updated = {
          ...this.author,
          email: this.authorInfo.email,
          introduction: this.authorInfo.bio,
          featuredWorks: this.authorInfo.works
        }
        await this.repository.save(updated, false)
        this.editMode = false
      } catch (e) {
        console.error('작가 정보 수정 실패', e)
      }
    },
    async editManuscript(item) {
      try {
        const updated = {
          ...item,
          content: item.content + ' (수정됨)'
        }
        
        const response = await this.repository.invoke(
          item,
          'edit',
          updated
        );

        const updatedManuscript = response.data;
        const index = this.manuscripts.findIndex(m => m.id === updatedManuscript.id);
        if (index !== -1) {
          this.manuscripts.splice(index, 1, updatedManuscript);
        }
        
        this.showSnackbar('원고가 수정되었습니다.', 'success')
      } catch (e) {
        alert('원고 수정 실패')
        console.error(e)
      }
    },
    viewManuscript(item) { // TODO: 원고 보는 페이지 => 원고 수정 페이지 보여주기 구현 필요
      console.log('원고 보기:', item)
    },
    async deleteManuscript(item) {
      try {
        const confirmed = confirm(`'${item.title}' 원고를 삭제하시겠습니까?`);
        if (!confirmed) return;

        await this.repository.invoke(item, 'delete', {});
        
        const index = this.manuscripts.findIndex(m => m.id === item.id);
        if (index !== -1) {
          this.manuscripts.splice(index, 1);
        }
        
        alert('원고가 삭제되었습니다.')
      } catch (e) {
        alert('삭제에 실패했습니다.');
        console.error(e);
      }
    },
    async requestAiAutomation(item) {
      try {
        const response = await this.repository.invoke(
          item,
          'aiGenerate',
          {}
        );

        const updatedManuscript = response.data;
        const index = this.manuscripts.findIndex(m => m.id === updatedManuscript.id);
        if (index !== -1) {
          this.manuscripts.splice(index, 1, updatedManuscript);
        }
        
        alert('AI 자동화 요청이 전송되었습니다.')
      } catch (e) {
        alert('AI 자동화 요청 실패')
        console.error(e)
      }
    },
    async requestPublication(item) {
      try {
        const response = await this.repository.invoke(
          item,
          'request-publish',
          {}
        );

        const updatedManuscript = response.data;
        const index = this.manuscripts.findIndex(m => m.id === updatedManuscript.id);
        if (index !== -1) {
          this.manuscripts.splice(index, 1, updatedManuscript);
        }

        alert('출간 요청이 완료되었습니다.')
      } catch (e) {
        alert('출간 요청 실패')
        console.error(e)
      }
    },
  }
}
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
