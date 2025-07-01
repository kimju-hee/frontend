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
            <div class="mb-5 text-lg font-bold"></div>
            <div class="table-responsive">
                <v-table>
                    <thead>
                        <tr>
                        <th>Id</th>
                        <th>Email</th>
                        <th>사용자 이름</th>
                        <th>보유 포인트</th>
                        <th>구독권 구매 여부</th>
                        <th>알림 메시지</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(val, idx) in value" 
                            @click="changeSelectedRow(val)"
                            :key="val"  
                            :style="val === selectedRow ? 'background-color: rgb(var(--v-theme-primary), 0.2) !important;':''"
                        >
                            <td class="font-semibold">{{ idx + 1 }}</td>
                            <td class="whitespace-nowrap" label="Email">{{ val.email }}</td>
                            <td class="whitespace-nowrap" label="사용자 이름">{{ val.userName }}</td>
                            <td class="whitespace-nowrap" label="보유 포인트">{{ val.point }}</td>
                            <td class="whitespace-nowrap" label="구독권 구매 여부">{{ val.isPurchase }}</td>
                            <td class="whitespace-nowrap" label="알림 메시지">{{ val.mseeage }}</td>
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

export default {
    name: 'userGrid',
    mixins:[BaseGrid],
    components:{
    },
    data: () => ({
        path: 'users',
    }),
    watch: {
    },
    methods:{
    }
}
</script>
