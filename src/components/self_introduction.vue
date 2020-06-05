<template>
  <article>
    <h1>Self introduction</h1>
    <div id="picture">
      <label for='imgUpload'>
        <img :src="imgsrc"
             alt="avatar" />
      </label>
    </div>
    <input type="file"
           id='imgUpload'
           name='imgUpload'
           style='display: none;'
           accept="image/*"
           @change='uploadImg'>
    <div id="box">
      <div v-for='(value, key) in user'>{{ key }}: <input type='text'
               v-model="user[key]"></div>
    </div>
    </div>
    <div id="button">
      <span id="confirm"
            @click="confirm">confirm</span>
      <span id="cancel"
            @click="cancel">cancel</span>
    </div>
  </article>
</template>

<script>
export default {
  data () {
    return {
      user: {
        name: '',
        signature: '',
        introduce: '',
        email: ''
      },
      imgsrc: '', // 记录头像链接地址
      username: '', // 用于定位到要修改的数据
      saveData: {} // 记录修改前请求的数据
    }
  },
  methods: {
    confirm () {
      const _this = this
      if (
        !this.user.name || // 没有填写用户名
        (this.user.name === this.saveData.name &&
          this.user.signature === this.saveData.signature &&
          this.user.introduce === this.saveData.introduce &&
          this.user.email === this.saveData.username) // 没有修改数据
      ) {
        return false
      }
      const whereStr = { "name": this.username }
      const updateStr = {
        $set: {
          "name": this.user.name,
          "signature": this.user.signature,
          "introduce": this.user.introduce,
          "email": this.user.email
        }
      }
      this.$reqs.post('/users/updateInformation', [whereStr, updateStr]).then(result => {
        if (result.data.success === true) {
          console.log('change is completed')
          window.location.href = './selfIntroduct'
        } else {
          console.log('Style change failed')
        }
      }).catch(error => {
        console.log(error)
      })
    }, cancel () {
      this.user.name = this.saveData.name
      this.user.signature = this.saveData.signature
      this.user.introduce = this.saveData.introduce
      this.user.email = this.saveData.email
    }, uploadImg () {
      const file = event.target.files[0]
      const formdata = new FormData()
      formdata.append('imgFile', file)
      this.$reqs.post('/users/avatar', formdata).then(result => {
        if (result.data.success) {
          window.location.href = './selfIntroduct'
        }
      }).catch(error => console.log(error))
    }
  }, mounted () {
    const _this = this
    this.$reqs.post('/users/information', {}).then(result => {
      _this.user = {
        name: result.data.name,
        signature: result.data.signature,
        introduce: result.data.introduce,
        email: result.data.email
      }
      _this.imgsrc = result.data.imgsrc
      _this.username = result.data.name // 用于定位到要修改的数据
      _this.saveData = {
        name: result.data.name,
        signature: result.data.signature,
        introduce: result.data.introduce,
        email: result.data.email
      } // 记录修改前请求的数据
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>

<style scoped>
#picture img {
  width: 180px;
  height: 180px;
  min-width: 180px;
  min-height: 180px;
  border-radius: 50%;
  box-shadow: 0 0 5px black;
  cursor: pointer;
  object-fit: cover;
}

#picture {
  width: 180px;
  height: 180px;
  margin: 50px auto;
}

#box {
  width: 600px;
  margin: 20px auto;
  text-align: left;
}

#box > div {
  font-size: 25px;
  font-weight: lighter;
  margin: 10px auto;
}

#box > div > input {
  width: 600px;
  height: 30px;
  line-height: 30px;
  font-size: 25px;
  border: 0;
  border-bottom: 1px solid #ccc;
  outline: none;
  margin: 10px 0;
}

#box > div > input:focus {
  border-bottom-color: #999;
}

#button {
  width: 320px;
  margin: 80px auto 0;
  font-size: 0;
}

#confirm,
#cancel {
  display: inline-block;
  width: 160px;
  font-size: 25px;
  font-weight: lighter;
  cursor: pointer;
  background-color: white;
  box-sizing: border-box;
  text-align: center;
  transition: background-color, color 0.5s;
}

#confirm:hover,
#cancel:hover {
  background-color: black;
  color: white;
}

#confirm {
  border-right: 1px solid black;
}
</style>