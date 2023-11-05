import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';

import { useUserStore } from '@/store/user';

const routes: RouteRecordRaw[] = [
  {
    path: '/articleCat',
    component: () => import('@/layouts/ArticleCat.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: ':id',
        name: 'articleCat',
        component: () => import('@/views/ArticleCat.vue'),
        meta: {
          title: '文章分类',
        },
      },
    ],
  },
  {
    path: '',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/article/:id',
        component: () => import('@/views/Article.vue'),
        meta: {
          title: '文章',
        },
      },
      {
        path: '/register',
        component: () => import('@/views/Register.vue'),
        meta: {
          title: '注册',
        },
      },
      {
        path: '/login',
        component: () => import('@/views/Login.vue'),
        meta: {
          title: '登录',
        },
      },
      {
        path: '/logout',
        redirect() {
          useUserStore().info = null;
          return '/login';
        },
      },
      {
        path: '/profile',
        component: () => import('@/views/Profile.vue'),
        meta: {
          title: '用户',
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  switch (to.path) {
    case '/register':
    case '/login':
      if (useUserStore().info) {
        next('/profile');
        return;
      }
      break;
    case '/profile':
      if (!useUserStore().info) {
        next('/login');
        return;
      }
      break;
  }
  next();
});

export default router;
