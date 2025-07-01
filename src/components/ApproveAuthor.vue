<template>
  <v-card class="pa-6">
    <v-card-title>✅ 작가 승인</v-card-title>
    <v-card-text>
      <b>{{ authorName }}</b> 작가를 승인하시겠습니까?
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="secondary" text @click="$emit('closeDialog')">취소</v-btn>
      <v-btn color="primary" @click="$emit('approveAuthor')">확인</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({ authorName: String });

const emit = defineEmits(['closeDialog', 'approveAuthor']);

const editMode = ref(true);
const value = ref({ isApprove: false });

const approveAuthor = () => {
  emit('approveAuthor', value.value);
};

const close = () => {
  emit('closeDialog');
};

const change = () => {
  emit("update:modelValue", value.value);
};
</script>
