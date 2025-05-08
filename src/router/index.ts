import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/schedule',
      name: 'Schedule',
      component: () => import('../views/Schedule.vue'),
      beforeEnter: (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
        const username = localStorage.getItem('username')
        const password = localStorage.getItem('password')
        
        if (!username || !password) {
          next('/login')
        } else {
          next()
        }
      }
    }
  ]
})

export default router