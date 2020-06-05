<template>
  <div id='body'>
    <Aside @login='showLogin = true'
           @logout='showLogout = true'
           :class="isBlur" />
    <router-view :class="isBlur">
    </router-view>
    <Login v-if="showLogin"
           @closeLogin='showLogin = false'
           :userInfo='userInfo' />
    <Logout v-if="showLogout"
            @closeLogout='showLogout = false' />
  </div>
</template>

<script>
import Aside from '../components/aside'
import Login from '../components/Login'
import Logout from '../components/Logout'

export default {
  data () {
    return {
      showLogin: false,
      showLogout: false,
      userInfo: {},
      backstage: ['console', 'writeALog', 'recycleBin', 'selfIntroduct']
    }
  }, methods: {
    checkList (str) {
      for (let i = 0; i < this.backstage.length; i++) {
        if (str.indexOf(this.backstage[i]) !== -1) {
          return true
        }
      }
      return false
    }
  },
  components: {
    Aside, Login, Logout
  }, computed: {
    isBlur () {
      return this.showLogin === true || this.showLogout === true ? 'blur' : ''
    }
  }, mounted () {
    // 判断前往后台时是否已登录
    const path = this.$route.path
    if (!sessionStorage.getItem('login') && this.checkList(path)) {
      alert('请先登录')
      window.location.href = './home'
      return false
    }

    // 第一次打开页面，将请求到的用户名和头像地址存放到userInfo中，后面更换页面时用watch监视，不用重新请求服务器
    if (!this.userInfo.name) {
      const _this = this
      this.$reqs.post('/users/information', {}).then(result => {
        _this.userInfo.name = result.data.name
        _this.userInfo.imgsrc = result.data.imgsrc
        document.getElementsByTagName('title')[0].innerText = this.$route.name + ' | ' + result.data.name
      }).catch(error => console.log(error))
    } else {
      return false
    }
  }, watch: {
    '$route' (newPath, oldPath) {
      // 判断是否在未登录的情况下前往后台
      const path = this.$route.path
      console.log(this.checkList(path))
      if (!sessionStorage.getItem('login') && this.checkList(path)) {
        alert('请先登录')
        window.location.href = './home'
        return false
      }
      // 监听$route 如果地址栏有变化，更新title
      document.getElementsByTagName('title')[0].innerText = newPath.name + ' | ' + this.userInfo.name
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: auto;
}

#body,
#app {
  height: 100%;
  width: 100%;
  display: flex;
}
.blur {
  filter: blur(2px);
}

.em-style {
  color: #999;
  display: block;
  text-align: center;
  font-size: 20px;
  font-weight: lighter;
  margin: 30px auto;
}

/* 左边侧边栏样式 */
aside {
  flex: 1 1 400px;
  min-width: 300px;
  max-width: 400px;
  height: 100%;
  background-color: #141414;
  top: 0;
  left: 0;
  text-align: right;
  padding: 50px 40px;
  box-sizing: border-box;
}

/*右边内容栏样式*/
article {
  flex: 1 1 1000px;
  min-height: 100%;
  min-width: 1000px;
  background-color: white;
  text-align: left;
  box-sizing: border-box;
  overflow: auto;
  padding: 50px;
}

article > h1 {
  font-size: 40px;
  display: block;
  margin: 0 0 10px;
  font-weight: lighter;
  text-align: left;
}

/*滚动条样式*/
body::-webkit-scrollbar,
article::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

body::-webkit-scrollbar-track,
article::-webkit-scrollbar-track {
  background-color: transparent;
}

body::-webkit-scrollbar-thumb,
article::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 1.5px;
  border-radius: 1.5px;
}
</style>