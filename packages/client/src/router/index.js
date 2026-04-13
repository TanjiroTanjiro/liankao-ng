
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/contests'
  },
  {
    path: '/contests',
    name: 'ContestList',
    component: () => import('../views/ContestList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/problems',
    name: 'ProblemList',
    component: () => import('../views/ProblemList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/contests/:id',
    name: 'ContestDetail',
    component: () => import('../views/ContestDetail.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  console.log('Route guard:', {
    to: to.path,
    from: from.path,
    isLoggedIn: userStore.isLoggedIn,
    token: userStore.token
  })

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    console.log('Redirecting to login')
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && userStore.isLoggedIn) {
    console.log('Redirecting to contests')
    next('/contests')
  } else {
    console.log('Allowing navigation')
    next()
  }
})

export default router
