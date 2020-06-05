import Vue from 'vue'
import Router from 'vue-router'
import Index from '../pages/index.vue'
import Home from '../components/home'
import Articles from '../components/Articles'
import Author from '../components/author'
import Console from '../components/console'
import Essay from '../components/essay'
import SelfIntroduct from '../components/self_introduction'
import WriteALog from '../components/write_a_log'
import RecycleBin from '../components/recycle_bin'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect: './home',
      children: [
        { path: 'home', name: 'Home', component: Home },
        { path: 'articles', name: 'Articles', component: Articles },
        { path: 'author', name: 'Author', component: Author },
        { path: 'console', name: 'Console', component: Console },
        { path: 'essay', name: 'Essay', component: Essay },
        {
          path: 'selfIntroduct',
          name: 'Self Introduct',
          component: SelfIntroduct
        },
        { path: 'writeALog', name: 'Write A Log', component: WriteALog },
        { path: 'recycleBin', name: 'Recycle Bin', component: RecycleBin },
        { path: '*', redirect: './home' }
      ]
    }
  ]
})
