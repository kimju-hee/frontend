<template>
    <v-card>
        <v-card-title class="text-h6 font-weight-bold">
            작가 비승인
        </v-card-title>

        <v-card-text>
            <v-alert
                type="warning"
                variant="tonal"
                class="mb-4"
            >
                해당 작가를 비승인 처리하시겠습니까?
            </v-alert>
            <Boolean label="승인 여부" v-model="value.isApprove" :editMode="editMode"/>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="error"
                @click="disapproveAuthor"
            >
                비승인
            </v-btn>
            <v-btn
                variant="outlined"
                @click="close"
            >
                취소
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: 'DisapproveAuthorCommand',
    components:{
    },
    props: {},
    data: () => ({
        editMode: true,
        value: {},
    }),
    created() {
        this.value.isApprove = false;
    },
    watch: {
    },
    methods: {
        disapproveAuthor() {
            this.$emit('disapproveAuthor', this.value);
        },
        close() {
            this.$emit('closeDialog');
        },
        change() {
            this.$emit("update:modelValue", this.value);
        },
    }
}
</script>
