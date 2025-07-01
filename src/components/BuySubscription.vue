<template>
    <v-card>
        <v-card-title class="text-h6 font-weight-bold">
            구독권 구매
        </v-card-title>

        <v-card-text>
            <v-alert
                type="info"
                variant="tonal"
                class="mb-4"
            >
                월정액 구독을 통해 모든 도서를 무제한으로 이용할 수 있습니다.
            </v-alert>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                @click="buySubscription"
            >
                구독 신청
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
    name: 'BuySubscriptionCommand',
    components:{
    },
    props: {},
    data: () => ({
        editMode: true,
        value: {},
    }),
    created() {
        this.value.isPurchase = false;
    },
    watch: {
    },
    methods: {
        buySubscription() {
            this.value.isPurchase = true;
            this.$emit('buySubscription', this.value);
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
