import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import tabellaView from '../views/AboutView.vue'

const routes = [
  {
    path: '/grafico',
    name: 'grafico',
    component: HomeView
  },
  {
    path: '/tabella',
    name: 'tabella',
    component: tabellaView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
