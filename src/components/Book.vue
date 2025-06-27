<template>
    <div>
        <String
            label="도서명"
            v-model="value.bookName"
            :editMode="editMode"
        />
        <String
            label="카테고리"
            v-model="value.category"
            :editMode="editMode"
        />
        <Boolean
            label="베스트셀러여부"
            v-model="value.isBestSeller"
            :editMode="editMode"
        />
        <String
            label="작가명"
            v-model="value.authorName"
            :editMode="editMode"
        />
        <v-row class="ma-0 pa-0">
            <v-spacer></v-spacer>
            <v-btn width="64px" color="primary" @click="save">
                저장
            </v-btn>
        </v-row>
    </div>
</template>


<script>
import BaseEntity from './base-ui/BaseEntity.vue'

export default {
    name: 'Book',
    mixins:[BaseEntity],
    components:{
    },
    
    data: () => ({
        path: "books",
        value: {
        }
    }),
    created(){
    },
    computed:{
    },
    methods: {
    },
}
</script>
