// Composables
import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router';
import { useUserStore } from '@/store/user'

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
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
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
      if (!(useUserStore().info)) {
        next('/login');
        return;
      }
      break;
  }
  next();
});

export default router;
