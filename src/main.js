// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

// 阻止vue启动生产模式提醒
Vue.config.productionTip = false
// 跨域保存session用
axios.defaults.withCredentials = true
// 打包的时候直接删掉，默认基础路径在这里配置
axios.defaults.baseURL = 'http://localhost:3000'
// 将axios赋值给Vue。方便在子组件里面使用
Vue.prototype.$reqs = axios

/* eslint-disable no-new */
const VueApp = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// 触发axios时才会判断是否需要拦截
/*
axios.interceptors.response.use(
  res => {
    // res.data.err存在的时候，通过alert提示用户
    if (res.data.err) {
      alert(res.data.err)
      return Promise.reject(res)
    } else if (!sessionStorage.getItem('login')) {
      // 当服务端发起重定向命令时
      alert('请先登录...')
      window.location.href = './home'
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => Promise.reject(error)
)
 */
