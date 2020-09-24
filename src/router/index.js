import Vue from 'vue'
import Router from 'vue-router'
import i18n from '@/i18n'
const index = () => import('@/views/index')
const userList = () => import('@/views/user/userList')

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    name: 'index',
    component: index,
    redirect: 'userList',
    children: [{
      path: 'userList',
      name: 'userList',
      component: userList
    }]
  },
]

export const createRouter = routes => new Router({
  // mode: 'history',
  routes
});

export const router = createRouter(constantRoutes)
