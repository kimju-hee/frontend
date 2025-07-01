<template>
    <v-card outlined class="getbookbyid-card">
        <v-card-text>
            <v-row class="getbookbyid-row" no-gutters>
                <v-col class="getbookbyid-col">
                    <Number label="Id" v-model.number="value.parameters.id" :editMode="editMode"/>
                </v-col>
                <v-col class="getbookbyid-col">
                    <String label="제목" v-model="value.parameters.bookName" :editMode="editMode"/>
                </v-col>
                <v-col class="getbookbyid-col">
                    <String label="작가" v-model="value.parameters.authorName" :editMode="editMode"/>
                </v-col>
                <v-col class="getbookbyid-col">
                    <String label="카테고리" v-model="value.parameters.category" :editMode="editMode"/>
                </v-col>
                <v-col class="getbookbyid-col">
                    <Boolean label="베스트셀러 여부" v-model="value.parameters.isBestSeller" :editMode="editMode"/>
                </v-col>
                <v-col class="getbookbyid-btncol">
                    <v-btn class="getbookbyid-search-btn" @click="search" small color="primary">
                        <v-icon small class="mr-2">mdi-magnify</v-icon>검색
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        name: 'GetBookById',
        components:{
        },
        props: {},
        data: () => ({
            editMode: true,
            value: {
                apiPath: 'books/search/getBookById',
                parameters: {}
            },
        }),
        created() {
        },
        watch: {
        },
        methods: {
            search() {
                let search = null;
                search = this.value;
                this.$emit('search', search);
            },
            change() {
                this.$emit("update:modelValue", this.value);
            },
        }
    }
</script>

<style scoped>
.getbookbyid-card {
    border-radius: 8px;
    margin-top: 10px;
    padding-bottom: 10px;
    background: #F4F5FA;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.getbookbyid-row {
    margin: 0;
    gap: 16px;
    align-items: flex-end;
}
.getbookbyid-col {
    min-width: 120px;
    max-width: 180px;
    flex: 1 1 120px;
    padding: 0 4px;
}
.getbookbyid-btncol {
    min-width: 120px;
    display: flex;
    align-items: flex-end;
    padding-left: 12px;
}
.getbookbyid-search-btn {
    min-width: 90px;
    font-weight: 500;
    box-shadow: none;
}
</style>
