import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting
const createListView = id => () => import('../views/CreateListView').then(m => m.default(id))
const ItemView = () => import('../views/ItemView.vue')
const FormView = () => import('../views/FormView.vue')

export function createRouter () {
  return new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/advise/:page(\\d+)?', component: createListView('advise') },
      { path: '/item/:id(\\S+)', component: ItemView },
      { path: '/form', component: FormView },
      { path: '/', redirect: '/advise' }
    ]
  })
}
