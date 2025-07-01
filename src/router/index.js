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
    {
      path: '/login',
      component: () => import('../components/pages/Login.vue'),
    },
    {
      path: '/author-home',
      component: () => import('../components/pages/AuthorHome.vue'),
    },
  ],
})

export default router;
