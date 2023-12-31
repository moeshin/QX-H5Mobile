import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';

import { useAuthStore } from '@/store/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('@/layouts/default/WDefault.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/WHome.vue'),
        meta: {
          title: '首页',
          showArticleCatNavBar: true,
        },
      },
      {
        path: '/articleCat/:id',
        name: 'articleCat',
        component: () => import('@/components/WArticleNavWindow.vue'),
        meta: {
          title: '文章分类',
          showArticleCatNavBar: true,
        },
      },
      {
        path: '/articles',
        name: 'articles',
        component: () => import('@/components/WArticleNavWindow.vue'),
        meta: {
          title: '所有文章',
          showArticleCatNavBar: true,
        },
      },
      {
        path: '/article/:id',
        name: 'article',
        component: () => import('@/views/WArticle.vue'),
        meta: {
          title: '文章',
        },
      },
      {
        path: '/register',
        component: () => import('@/views/WRegister.vue'),
        meta: {
          title: '注册',
        },
      },
      {
        path: '/login',
        component: () => import('@/views/WLogin.vue'),
        meta: {
          title: '登录',
        },
      },
      {
        path: '/logout',
        redirect() {
          useAuthStore().user = undefined;
          return '/login';
        },
        meta: {
          title: '登出',
        },
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/WProfile.vue'),
        meta: {
          title: '个人信息',
        },
      },
      {
        path: '/user/:id',
        name: 'user',
        component: () => import('@/views/WProfile.vue'),
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
      if (useAuthStore().isLogin) {
        next('/profile');
        return;
      }
      break;
    default:
      if (!useAuthStore().isLogin) {
        next('/login');
        return;
      }
  }
  next();
});

router.afterEach((to) => {
  const title = to.meta.title as string | undefined;
  if (title) {
    document.title = title;
  }
});

export default router;
