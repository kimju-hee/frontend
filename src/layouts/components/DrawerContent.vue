<script setup>
import {
  VerticalNavLink,
  VerticalNavSectionTitle,
} from '@layouts'
</script>

<template>
  <ul>
    <VerticalNavSectionTitle :item="{ heading: '관리자 메뉴' }" />
    <VerticalNavLink
      :item="{
        title: '작가 관리',
        to: '/author-management',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '독자 관리',
        to: '/user-management',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '도서 관리',
        to: '/book-management',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'AI 처리 결과',
        to: '/ai-result',
      }"
    />
  </ul>
</template>
