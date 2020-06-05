<template>
  <div id="mask">
    <div id="log-box"
         @keyup.enter="isComplete">

      <!--需要数据处理方法 -->
      <img :src="imgsrc"
           alt="log-img"
           id='log-img'>
      <div id="log-name">
        username: <input type="text"
               name='log-name'
               autocomplete=”off”
               @blur="isBlur">
      </div>
      <div id="log-password">
        password: <input type="password"
               name="log-password"
               autocomplete=”off”
               @blur="isBlur">
      </div>
      <div id='clean'
           @click='isClear'>reset</div>
      <div id='login'
           @click="isComplete"
           :disabled='disable'>{{loginText}}</div>
      <span v-if='error'
            id='error'>{{ error }}</span>
    </div>
    <div id="close"
         @click='closeLogin'>×</div>
  </div>
</template>
<!--
  1.通过sessionstorage记录是否通过用户名，密码的方式登录，只需要标记是否登录，不需要记录用户名，密码
  2.退出时删除sessionstorage
  3.没有查找到相关sessionstorage时，当作没有按照指定方式登录，如果请求后台却没找到sessionstorage，强制回到home
  问题：用户可以直接在本地创建sessionstorage用于登录后台
  解决办法：使用express-session，将记录保存在服务端
-->
<script>
export default {
  props: ['userInfo'],
  data () {
    return {
      error: '',
      disable: false,
      loginText: 'login',
      imgsrc: this.userInfo.imgsrc
    }
  },
  methods: {
    // 对输入结果进行判断
    isComplete () {
      const [username, password] = this.isBlur()
      if (username.value === '') {
        username.style.border = '1px solid red'
      } else if (password.value === '') {
        password.style.border = '1px solid red'
      } else {
        const _this = this
        this.disable = true
        this.loginText = 'login...'
        // console.log(username.value + '||' + password.value)
        this.$reqs.post('/users/login', {
          username: username.value,
          password: password.value
        }).then(result => {
          // console.log(result)
          if (result.data.hasOwnProperty('success') && result.data.success === true) {
            // 登录成功
            sessionStorage.setItem('login', true)
            window.location.href = './console'
          } else {
            _this.error = result.data.err
            console.log(_this.error)
          }
          _this.disable = false;
          _this.loginText = 'login'
        }).catch(error => {
          _this.disable = false
          _this.loginText = 'login'
          console.log(error)
        })
      }
    },
    // 还原成原本样式
    isBlur () {
      const username = document.getElementById('log-name').children[0]
      const password = document.getElementById('log-password').children[0]
      username.style.border = 0
      username.style.borderBottom = '1px solid black'
      password.style.border = 0
      password.style.borderBottom = '1px solid black'
      return [username, password]
    },
    closeLogin () {
      this.$emit('closeLogin')
    },
    isClear () {
      const [username, password] = this.isBlur()
      username.value = ''
      password.value = ''
    }
  }
}
</script>

<style scoped>
#mask {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  z-index: 2;
  color: black;
  background-color: transparent;
}

#log-box {
  width: 50%;
  min-width: 500px;
  height: 50%;
  min-height: 500px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  font-size: 0;
  text-align: center;
}

#close {
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 25px;
  text-align: center;
  display: inline-block;
  position: absolute;
  top: 50px;
  right: 50px;
  border: 1px solid black;
  background-color: white;
  color: black;
  cursor: pointer;
  transition: background-color, color 0.5s;
}

#close:hover {
  background-color: black;
  color: white;
}

#log-img {
  width: 180px;
  height: 180px;
  display: inline-block;
  margin-top: 50px;
  margin-bottom: 30px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 0 5px black;
  object-fit: cover;
}

#log-name,
#log-password {
  font-size: 25px;
  font-weight: lighter;
  margin-top: 20px;
  margin-bottom: 20px;
}

#log-name > input,
#log-password > input {
  width: 185px;
  height: 30px;
  line-height: 30px;
  font-size: 25px;
  border: 0;
  box-sizing: border-box;
  background-color: transparent;
  color: black;
  border-bottom: 1px solid black;
  outline: none;
  margin-left: 10px;
}

#log-name > input:focus,
#log-password > input:focus {
  border-bottom-color: #999;
}

#clean,
#login {
  display: inline-block;
  width: 160px;
  font-size: 25px;
  font-weight: lighter;
  cursor: pointer;
  background-color: transparent;
  color: black;
  box-sizing: border-box;
  margin-top: 10px;
  text-align: center;
  transition: background-color, color 0.5s;
}

#clean:hover,
#login:hover {
  background-color: black;
  color: white;
}

#clean {
  border-right: 1px solid black;
}

#error {
  display: block;
  width: 80%;
  margin: 20px auto;
  font-size: 15px;
  color: red;
}
</style>