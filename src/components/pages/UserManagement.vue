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
            <div class="mb-5 text-lg font-bold"></div>
            <div class="table-responsive">
                <VDataTable
                    :headers="headers"
                    :items="usersWithPoints"
                    item-key="id"
                    :items-per-page="10"
                    class="elevation-1"
                    @click:row="changeSelectedRow"
                >
                    <template #item="{ item, index }">
                        <tr :class="{ 'selected-row-class': item === selectedRow }" @click="changeSelectedRow(item)">
                            <td class="font-semibold">{{ index + 1 }}</td>
                            <td class="whitespace-nowrap">{{ item.userName }}</td>
                            <td class="whitespace-nowrap">{{ item.point || 0 }}</td>
                            <td class="whitespace-nowrap">{{ item.isPurchase }}</td>
                            <td class="whitespace-nowrap">{{ item.email }}</td>
                            <td class="whitespace-nowrap">{{ item.message }}</td>
                        </tr>
                    </template>
                </VDataTable>
            </div>
        </div>
    </v-container>
</template>

<script>
import axios from '@/plugins/axios';
import { VDataTable } from 'vuetify/labs/VDataTable'

export default {
    name: 'UserManagement',
    components: {
        VDataTable,
    },
    data() {
        return {
            path: '/users',
            pointPath: '/points/userId',
            users: [], // 사용자 목록
            usersWithPoints: [], // 포인트 정보가 추가된 사용자 목록
            selectedRow: null,
            snackbar: {
                status: false,
                timeout: 5000,
                text: '',
                color: 'info',
            },
            headers: [
                { title: 'No.', key: 'id', sortable: false },
                { title: '독자명', key: 'userName' },
                { title: '보유 포인트', key: 'point' },
                { title: '월정액 구독 여부', key: 'isPurchase' },
                { title: 'Email', key: 'email' },
                { title: '알림 메시지', key: 'message' },
            ],
        };
    },
    created() {
        this.fetchUsersAndPoints();
    },
    methods: {
        async fetchUsersAndPoints() {
            try {
                const userResponse = await axios.get(this.path);
                // Spring Data REST 응답 구조에 맞게 _embedded.users 추출
                this.users = userResponse.data._embedded.users || [];

                const pointPromises = this.users.map(async user => {
                    try {
                        // user.id는 Long 타입이므로 String으로 변환하여 API에 전달
                        const pointResponse = await axios.get(`${this.pointPath}/${String(user.id)}`); // user.id를 String으로 변환
                        return { ...user, point: pointResponse.data.point }; // 기존 사용자 정보에 point 추가
                    } catch (pointError) {
                        console.warn(`[UserManagement] Point not found for user ID: ${user.id}`, pointError);
                        return { ...user, point: 0 }; // 포인트가 없을 경우 0으로 처리
                    }
                });
                this.usersWithPoints = await Promise.all(pointPromises); // 모든 포인트 조회 요청이 완료될 때까지 기다림

                // 성공 메시지 표시 (선택 사항)
                this.snackbar.text = '사용자 및 포인트 정보를 성공적으로 불러왔습니다.';
                this.snackbar.color = 'success';
                this.snackbar.status = true;

            } catch (e) {
                // 최상위 catch 블록에서 에러 스낵바 호출
                this.showError(e);
            }
        },
        // @click:row 이벤트는 item과 row 두 인자를 전달합니다.
        changeSelectedRow(event, { item }) { // event는 돔 이벤트, item은 클릭된 아이템 데이터
            // 이미 선택된 행을 다시 클릭하면 선택 해제
            if (this.selectedRow === item) {
                this.selectedRow = null;
            } else {
                this.selectedRow = item;
            }
        },
        showError(e) {
            this.snackbar.status = true;
            this.snackbar.color = 'error';
            if (e.response && e.response.data && e.response.data.message) {
                this.snackbar.text = e.response.data.message;
            } else {
                this.snackbar.text = e.message || '알 수 없는 오류가 발생했습니다.';
            }
        },
    },
};
</script>

<style scoped>
/* 선택된 행의 배경색을 위한 CSS 클래스 */
.selected-row-class {
    background-color: rgb(var(--v-theme-primary), 0.2) !important;
}
</style>
