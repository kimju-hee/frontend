<template>
  <v-card class="pa-6">
    <v-card-title>⚠️ 작가 비승인</v-card-title>
    <v-card-text>
      <b>{{ authorName }}</b> 작가를 비승인 처리하시겠습니까?
      <v-text-field
        v-model="reason"
        label="사유를 입력하세요"
        variant="underlined"
        class="mt-4"
        required
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="secondary"
        text
        @click="$emit('closeDialog')"
        >취소</v-btn
      >
      <v-btn
        color="error"
        @click="onDisapprove"
        :disabled="!reason"
        >확인</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  authorName: String,
  modelValue: String,
})
const emit = defineEmits(['closeDialog', 'disapproveAuthor', 'update:modelValue'])

const reason = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

function onDisapprove() {
  emit('disapproveAuthor', reason.value)
}
</script>
