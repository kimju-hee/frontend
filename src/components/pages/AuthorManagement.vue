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
            <div class="gs-bundle-of-buttons" style="max-height:10vh;">
                <v-btn :disabled="!selectedRow || !hasRole('Admin')" style="margin-left: 5px;" @click="approveAuthorDialog = true" class="contrast-primary-text" small color="primary">
                    <v-icon small>mdi-minus-circle-outline</v-icon>작가 승인
                </v-btn>
                <v-dialog v-model="approveAuthorDialog" width="500">
                    <ApproveAuthor
                        @closeDialog="approveAuthorDialog = false"
                        @approveAuthor="approveAuthor"
                    ></ApproveAuthor>
                </v-dialog>
                <v-btn :disabled="!selectedRow || !hasRole('Admin')" style="margin-left: 5px;" @click="disapproveAuthorDialog = true" class="contrast-primary-text" small color="primary">
                    <v-icon small>mdi-minus-circle-outline</v-icon>작가 비승인
                </v-btn>
                <v-dialog v-model="disapproveAuthorDialog" width="500">
                    <DisapproveAuthor
                        @closeDialog="disapproveAuthorDialog = false"
                        @disapproveAuthor="disapproveAuthor"
                    ></DisapproveAuthor>
                </v-dialog>
            </div>
            <div class="mb-5 text-lg font-bold"></div>
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
                            :key="val"  
                            :style="val === selectedRow ? 'background-color: rgb(var(--v-theme-primary), 0.2) !important;':''"
                        >
                            <td class="font-semibold">{{ idx + 1 }}</td>
                            <td class="whitespace-nowrap" label="작가명">{{ val.authorName }}</td>
                            <td class="whitespace-nowrap" label="작가 소개">{{ val.introduction }}</td>
                            <td class="whitespace-nowrap" label="대표작">{{ val.feturedWorks }}</td>
                            <td class="whitespace-nowrap" label="Email">{{ val.email }}</td>
                            <td class="whitespace-nowrap" label="승인 여부">{{ val.isApprove }}</td>
                            <v-row class="ma-0 pa-4 align-center">
                                <v-spacer></v-spacer>
                                <Icon style="cursor: pointer;" icon="mi:delete" @click="deleteRow(val)" />
                            </v-row>
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
    name: 'authorGrid',
    mixins:[BaseGrid],
    components:{
    },
    data: () => ({
        path: 'authors',
        approveAuthorDialog: false,
        disapproveAuthorDialog: false,
    }),
    watch: {
    },
    methods:{
        async approveAuthor(params){
            try{
                var path = "approveAuthor".toLowerCase();
                var temp = await this.repository.invoke(this.selectedRow, path, params)
                // 스넥바 관련 수정 필요
                // this.$EventBus.$emit('show-success','approve author 성공적으로 처리되었습니다.')
                for(var i = 0; i< this.value.length; i++){
                    if(this.value[i] == this.selectedRow){
                        this.value[i] = temp.data
                    }
                }
                this.approveAuthorDialog = false
            }catch(e){
                console.log(e)
            }
        },
        async disapproveAuthor(params){
            try{
                var path = "disapproveAuthor".toLowerCase();
                var temp = await this.repository.invoke(this.selectedRow, path, params)
                // 스넥바 관련 수정 필요
                // this.$EventBus.$emit('show-success','disapprove author 성공적으로 처리되었습니다.')
                for(var i = 0; i< this.value.length; i++){
                    if(this.value[i] == this.selectedRow){
                        this.value[i] = temp.data
                    }
                }
                this.disapproveAuthorDialog = false
            }catch(e){
                console.log(e)
            }
        },
    }
}

</script>
