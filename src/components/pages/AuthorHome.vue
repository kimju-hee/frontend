<template>
  <v-container fluid class="pa-8">
    <!-- 상단 인사말 및 승인 여부 -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              {{ authorName }} 작가님, 환영합니다!
            </h1>
            <div class="d-flex align-center">
              <v-icon 
                :icon="isApproved ? 'mdi-check-circle' : 'mdi-clock-outline'" 
                :color="isApproved ? 'success' : 'warning'"
                class="mr-2"
              ></v-icon>
              <span :class="isApproved ? 'text-success' : 'text-warning'">
                {{ isApproved ? '승인' : '미승인' }}
              </span>
            </div>
          </div>
          <v-btn
            color="primary"
            size="large"
            @click="createNewManuscript"
          >
            <v-icon left>mdi-plus</v-icon>
            새 원고 작성
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 작가 정보 섹션 -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>작가 정보</span>
            <v-btn
              color="primary"
              variant="outlined"
              @click="editMode = !editMode"
            >
              {{ editMode ? '취소' : '수정' }}
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form v-if="editMode" @submit.prevent="saveAuthorInfo">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="authorInfo.email"
                    label="이메일"
                    outlined
                    dense
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="authorInfo.bio"
                    label="작가 소개"
                    outlined
                    rows="4"
                    placeholder="자신을 소개해주세요..."
                  />
                </v-col>
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    color="success"
                    type="submit"
                    class="mr-2"
                  >
                    저장
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    @click="cancelEdit"
                  >
                    취소
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
            <div v-else>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="mb-4">
                    <strong>이메일:</strong>
                    <p class="mt-1">{{ authorInfo.email }}</p>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div>
                    <strong>작가 소개:</strong>
                    <p class="mt-1">{{ authorInfo.bio || '작가 소개가 없습니다.' }}</p>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 작품 목록 섹션 -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>
            <span>작품 목록</span>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="검색"
              single-line
              hide-details
              density="compact"
              style="max-width: 300px;"
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="manuscripts"
              :search="search"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.category="{ item }">
                <v-chip :color="getCategoryColor(item.category)" small>
                  {{ item.category }}
                </v-chip>
              </template>
              <template v-slot:item.approvalStatus="{ item }">
                <v-chip 
                  :color="item.approvalStatus === '승인' ? 'success' : 'warning'" 
                  small
                >
                  <v-icon left small>
                    {{ item.approvalStatus === '승인' ? 'mdi-check' : 'mdi-clock' }}
                  </v-icon>
                  {{ item.approvalStatus }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon
                  small
                  color="primary"
                  @click="viewManuscript(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="warning"
                  @click="editManuscript(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AuthorHome',
  data() {
    return {
      authorName: '김작가',
      isApproved: false,
      editMode: false,
      search: '',
      loading: false,
      authorInfo: {
        email: 'author@example.com',
        bio: '열정적인 작가입니다. 다양한 장르의 작품을 창작하고 있습니다.'
      },
      headers: [
        { title: '제목', key: 'title', sortable: true },
        { title: '카테고리', key: 'category', sortable: true },
        { title: '출간 승인 여부', key: 'approvalStatus', sortable: true },
        { title: '작성일', key: 'createdAt', sortable: true },
        { title: '작업', key: 'actions', sortable: false }
      ],
      manuscripts: [
        {
          id: 1,
          title: '첫 번째 작품',
          category: '소설',
          approvalStatus: '승인',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          title: '두 번째 작품',
          category: '에세이',
          approvalStatus: '미승인',
          createdAt: '2024-01-20'
        },
        {
          id: 3,
          title: '세 번째 작품',
          category: '시',
          approvalStatus: '미승인',
          createdAt: '2024-01-25'
        }
      ]
    }
  },
  methods: {
    createNewManuscript() {
      // 새 원고 작성 페이지로 이동
      this.$router.push('/manuscripts');
    },
    saveAuthorInfo() {
      // 작가 정보 저장 로직
      console.log('작가 정보 저장:', this.authorInfo);
      this.editMode = false;
      // 실제로는 API 호출
    },
    cancelEdit() {
      // 수정 취소 시 원래 데이터로 복원
      this.editMode = false;
    },
    viewManuscript(item) {
      // 원고 상세 보기
      console.log('원고 보기:', item);
    },
    editManuscript(item) {
      // 원고 수정
      console.log('원고 수정:', item);
    },
    getCategoryColor(category) {
      const colors = {
        '소설': 'primary',
        '에세이': 'secondary',
        '시': 'success',
        '논픽션': 'warning',
        '기타': 'info'
      };
      return colors[category] || 'grey';
    }
  }
}
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style> 
