<template>
  <div id="mask">
    <div id="main-box">
      <h1>Do you want to log out?</h1>
      <div id="button">
        <span @click="logout">
          <div class='btn'>Yes</div>
        </span>
        <span @click='closeLogout'>
          <div class='btn'>No</div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout () {
      sessionStorage.removeItem('login')
      window.location.href = '/home'
      /* 服务端登出记录(用于express-session)
      const _this = this
      this.$reqs.post('users/logout', {}).then(result => {
        _this.$emit('closeLogout')
        _this.$router.push({ path: '/' })
      }).catch(error => {
        cosole.log(error)
      }) 
      */
    }, closeLogout () {
      this.$emit('closeLogout')
    }
  }
}
</script>

<style scoped>
#mask {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  color: black;
  background-color: transparent;
  overflow: hidden;
}

#main-box {
  min-width: 50%;
  max-width: 60%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  background-color: white;
}

#main-box > h1 {
  font-size: 40px;
  font-weight: lighter;
  text-align: center;
}

#main-box > #button {
  margin: 20px 0;
  text-align: center;
  font-size: 0;
}

#button > span {
  width: 80px;
  height: 35px;
  line-height: 35px;
  font-size: 30px;
  font-weight: lighter;
  display: inline-block;
  cursor: pointer;
  color: black;
  background-color: white;
  transition: color, background-color 0.5s;
}

#button > span {
  border-right: 1px solid black;
}
#button > span:last-child {
  border-right: 0;
}

#button > span:hover {
  color: white;
  background-color: black;
}
</style>