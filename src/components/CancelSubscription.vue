<template>
    <v-card>
        <v-card-title class="text-h6 font-weight-bold">
            구독 해지
        </v-card-title>

        <v-card-text>
            <v-alert
                type="warning"
                variant="tonal"
                class="mb-4"
            >
                구독을 해지하시면 다음 결제일부터 서비스가 중단됩니다.
            </v-alert>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="error"
                @click="cancelSubscription"
            >
                구독 해지
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
    name: 'CancelSubscriptionCommand',
    components:{
    },
    props: {},
    data: () => ({
        editMode: true,
        value: {},
    }),
    created() {
    },
    watch: {
    },
    methods: {
        cancelSubscription() {
            this.value.isPurchase = false;
            this.$emit('cancelSubscription', this.value);
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
