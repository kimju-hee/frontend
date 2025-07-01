import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../components/pages/Index.vue'),
    },
    {
      path: '/authors',
      component: () => import('../components/ui/AuthorGrid.vue'),
    },
    {
      path: '/manuscripts',
      component: () => import('../components/ui/ManuscriptGrid.vue'),
    },
    {
      path: '/points',
      component: () => import('../components/ui/PointGrid.vue'),
    },
    {
      path: '/users',
      component: () => import('../components/ui/UserGrid.vue'),
    },
    {
      path: '/subscriptions',
      component: () => import('../components/ui/SubscriptionGrid.vue'),
    },
    {
      path: '/books',
      component: () => import('../components/ui/BookGrid.vue'),
    },
    {
      path: '/aiBookGenerations',
      component: () => import('../components/ui/AiBookGenerationGrid.vue'),
    },
    {
      path: '/processedResults',
      component: () => import('../components/ProcessedResultView.vue'),
    },
    // 페이지 생성
    {
      path: '/login',
      component: () => import('../components/pages/Login.vue'),
    },
    {
      path: '/author-home',
      component: () => import('../components/pages/AuthorHome.vue'),
    },
    {
      path: '/reader-home',
      component: () => import('../components/pages/ReaderHome.vue'),
    },
    {
      path: '/admin-home',
      component: () => import('../components/pages/AdminHome.vue'),
    },
    {
      path: '/author-management',
      component: () => import('../components/pages/AuthorManagement.vue'),
    },
    {
      path: '/user-management',
      component: () => import('../components/pages/UserManagement.vue'),
    },
    {
      path: '/book-management',
      component: () => import('../components/pages/BookManagement.vue'),
    },
    {
      path: '/ai-result',
      component: () => import('../components/pages/AIResult.vue'),
    },
    {
      path: '/book-list',
      component: () => import('../components/pages/BookList.vue'),
    },
  ],
})

export default router;
