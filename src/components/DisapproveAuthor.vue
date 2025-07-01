<template>
  <v-card class="pa-6">
    <v-card-title>⚠️ 작가 비승인</v-card-title>
    <v-card-text>
      <b>{{ authorName }}</b> 작가를 비승인 처리하시겠습니까?
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="secondary" text @click="$emit('closeDialog')">취소</v-btn>
      <v-btn color="error" @click="$emit('disapproveAuthor')">확인</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({ authorName: String });

const emit = defineEmits(['closeDialog', 'disapproveAuthor']);

const editMode = ref(true);
const value = ref({});

onMounted(() => {
  value.value.isApprove = false;
});

const disapproveAuthor = () => {
  emit('disapproveAuthor', value.value);
};

const close = () => {
  emit('closeDialog');
};

const change = () => {
  emit("update:modelValue", value.value);
};
</script>
