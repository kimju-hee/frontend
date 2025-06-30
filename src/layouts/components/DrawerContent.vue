<script setup>
import {
  VerticalNavLink,
  VerticalNavSectionTitle,
} from '@layouts'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 관리자 관련 페이지인지 확인
const isAdminPage = computed(() => {
  const adminPaths = [
    '/admin',
    '/authors', 
    '/manuscripts',
    '/aiBookGenerations',
    '/points',
    '/users',
    '/books'
  ]
  return adminPaths.includes(route.path)
})
</script>

<template>
  <ul>
    <!-- 관리자용 사이드바 -->
    <template v-if="isAdminPage">
      <VerticalNavSectionTitle :item="{ heading: '관리자 메뉴' }" />
      <VerticalNavLink
        :item="{
          title: '작가 관리',
          to: '/authors',
          icon: 'mdi-account-edit'
        }"
      />
      <VerticalNavLink
        :item="{
          title: '원고 관리',
          to: '/manuscripts',
          icon: 'mdi-file-document-edit'
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'AI 자동화 관리',
          to: '/aiBookGenerations',
          icon: 'mdi-robot'
        }"
      />
      <VerticalNavLink
        :item="{
          title: '포인트 관리',
          to: '/points',
          icon: 'mdi-currency-usd'
        }"
      />
      <VerticalNavLink
        :item="{
          title: '독자 관리',
          to: '/users',
          icon: 'mdi-account-group'
        }"
      />
      <VerticalNavLink
        :item="{
          title: '도서 관리',
          to: '/books',
          icon: 'mdi-book-open-variant'
        }"
      />
    </template>
    
    <!-- 기존 사이드바 -->
    <template v-else>
      <VerticalNavSectionTitle :item="{ heading: '작가관리' }" />
      <VerticalNavLink
        :item="{
          title: '작가',
          to: '/authors',
        }"
      />
      <VerticalNavSectionTitle :item="{ heading: '집필관리' }" />
      <VerticalNavLink
        :item="{
          title: '원고',
          to: '/manuscripts',
        }"
      />
      <VerticalNavSectionTitle :item="{ heading: '포인트관리' }" />
      <VerticalNavLink
        :item="{
          title: '포인트',
          to: '/points',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '포인트조회',
          to: '/getPoints',
        }"
      />
      <VerticalNavSectionTitle :item="{ heading: '구독자관리' }" />
      <VerticalNavLink
        :item="{
          title: '구독자',
          to: '/users',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '구독',
          to: '/subscriptions',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '구독 열람',
          to: '/getSubscriptions',
        }"
      />
      <VerticalNavSectionTitle :item="{ heading: '플랫폼' }" />
      <VerticalNavLink
        :item="{
          title: '도서',
          to: '/books',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '도서 조회',
          to: '/getBookByIds',
        }"
      />
      <VerticalNavSectionTitle :item="{ heading: 'AI도서처리' }" />
      <VerticalNavLink
        :item="{
          title: 'AI자동화',
          to: '/aiBookGenerations',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'AI도서처리결과',
          to: '/processedResults',
        }"
      />
    </template>
  </ul>
</template>
