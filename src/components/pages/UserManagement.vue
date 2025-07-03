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
          <!-- 왼쪽 영역 (현재는 비어있음) -->
        </div>
        <div>
          <template v-if="selectedRow">
            <v-btn
              variant="plain"
              style="margin-left: 8px"
              @click="deleteUser(selectedRow)"
              color="secondary"
            >
              <v-icon
                small
                class="mr-2"
                >mdi-delete</v-icon
              >
              독자 삭제
            </v-btn>
          </template>
          <template v-else>
            <v-btn
              variant="plain"
              style="visibility: hidden; margin-left: 8px"
              color="secondary"
            >
              <v-icon
                small
                class="mr-2"
                >mdi-delete</v-icon
              >
              독자 삭제
            </v-btn>
          </template>
        </div>
      </div>
      <div class="table-responsive">
        <VDataTable
          :headers="headers"
          :items="usersWithPoints"
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
              <td class="whitespace-nowrap">{{ item.userName }}</td>
              <td class="whitespace-nowrap">{{ item.point || 0 }}</td>
              <td class="whitespace-nowrap">{{ item.isPurchase ? '⭕' : '❌' }}</td>
              <td class="whitespace-nowrap">{{ item.email }}</td>
              <td class="whitespace-nowrap">{{ item.message }}</td>
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
  name: 'UserManagement',
  components: {
    VDataTable,
  },
  data() {
    return {
      path: 'users',
      pointPath: '/points/userId',
      repository: null,
      usersWithPoints: [
        {
          id: 11,
          userName: '홍길동',
          point: 1000,
          isPurchase: false,
          email: 'hong-r@test.com',
          message: '환영합니다!',
        },
      ],
      selectedRow: null,
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: 'error',
      headers: [
        { title: 'ID', key: 'id', sortable: true },
        { title: '독자명', key: 'userName', sortable: true },
        { title: '보유 포인트', key: 'point', sortable: true },
        { title: '월정액 구독 여부', key: 'isPurchase', sortable: true },
        { title: 'Email', key: 'email', sortable: false },
        { title: '알림 메시지', key: 'message', sortable: false },
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
    await this.fetchUsersAndPoints()
  },
  methods: {
    async fetchUsersAndPoints() {
      try {
        const users = await this.repository.find()
        const usersWithPointsPromises = users.map(async user => {
          let pointData = 0
          try {
            const res = await axios.get(`${this.pointPath}/${String(user.id)}`)
            pointData = res.data.point
          } catch (e) {
            console.warn(`Point not found for user ID ${user.id}:`, e)
            pointData = 0
          }
          return {
            ...user,
            point: pointData,
          }
        })
        this.usersWithPoints = await Promise.all(usersWithPointsPromises)
        this.usersWithPoints.sort((a, b) => a.id - b.id)
      } catch (e) {
        this.showError('독자 목록을 불러오지 못했습니다.', e)
      }
    },
    changeSelectedRow(item) {
      if (this.selectedRow === item) {
        this.selectedRow = null
      } else {
        this.selectedRow = item
      }
    },
    async deleteUser(row) {
      if (!row) return
      try {
        await this.repository.delete(row)
        this.usersWithPoints = this.usersWithPoints.filter(user => user.id !== row.id)
        this.selectedRow = null
        this.showSuccess('삭제 완료!')
      } catch (e) {
        this.showError('삭제에 실패했습니다.', e)
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
