import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/index/Home.vue'
import ViewPage from '../views/index/viewPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/viewpage',
    name: 'viewpage',
    component: ViewPage
  },
  {
    path: '/parser',
    name: 'parser',
    component: () => import(/* webpackChunkName: "parser-example" */'@/components/parser/example/Index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
