// Composables
import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'articleCat/:id',
        // name: 'ArticleCat',
        component: () => import('@/views/ArticleCat.vue'),
      },
    ],
  },
  {
    path: '/register',
    component: () => import('@/views/Register.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
