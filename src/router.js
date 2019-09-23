import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/admin',
      name: 'home',
      component: () => import('./views/admin/Home.vue')
    },
    {
      path: '/admin/category',
      name: 'category',
      component: () => import('./views/admin/Category/Home.vue')
    },
    {
      path: '/admin/product',
      name: 'product',
      component: () => import('./views/admin/Product/Home.vue')
    },
    {
      path: '/admin/product/increase',
      name: 'increase',
      component: () => import('./views/admin/Product/Increase.vue')
    },
    {
      path: '/admin/product/compile/:id',
      name: 'compile',
      component: () => import('./views/admin/Product/Compile.vue')
    },
    {
      path: '/admin/attestation/logon',
      name: 'logon',
      component: () => import('./views/admin/Attestation/Logon.vue')
    },
    {
      path: '/admin/attestation/registered',
      name: 'registered',
      component: () => import('./views/admin/Attestation/Registered.vue')
    },
  ]
})
