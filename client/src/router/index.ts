import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Rule from '@/pages/Rule.vue'
import HomeLayout from '@/layouts/default.vue'
import RuleLayout from '@/layouts/Role.vue'

const routes = [
  {
    path: '/',
    redirect: '/rule',
  },
  {
    path: '/rule',
    component: HomeLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
      },
      {
        path: ':ruleId',
        component: RuleLayout,
        children: [
          {
            path: '',
            name: 'rule',
            component: Rule,
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!sessionStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      sessionStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
      sessionStorage.removeItem('vuetify:dynamic-reload')
    }
  } else {
    console.error('Router Error:', err)
  }
})

router.isReady().then(() => {
  sessionStorage.removeItem('vuetify:dynamic-reload')
})

export default router
