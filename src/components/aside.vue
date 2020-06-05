<template>
  <aside>
    <header>
      <div @click='log'>
        <img :src='imgsrc'
             alt="avatar"
             id="avatar" /></div>
      <h1 id="name">
        <router-link :to="pageManage === 0 ? list[0][0].path : ''"
                     :style="pageManage === 0 ? 'cursor:pointer' : 'cursor:default'">{{ user[0] }}</router-link>
      </h1>
      <span id="signature">{{ user[1] }}</span>
    </header>
    <nav>
      <ul>
        <li v-for='item in listManage'>
          <router-link :to='item.path'>{{item.name}}</router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  data () {
    return {
      user: [],
      list: [
        [
          { name: 'home', path: './home' },
          { name: 'articles', path: './articles' },
          { name: 'author', path: './author' }
        ], [
          { name: 'console', path: './console' },
          { name: 'write a log', path: './writeALog' },
          { name: 'recycle bin', path: './recycleBin' },
          { name: 'self introduction', path: './selfIntroduct' }
        ]
      ],
      imgsrc: ''
    }
  }, computed: {
    // 判断当前地址是属于第一部分还是第二部分
    pageManage: function () {
      const path = this.$route.path
      const list = this.list
      let pos = 0
      list.map((pages, index) => {
        pages.map(page => {
          if (page.path === '.' + path) {
            pos = index
          }
        })
      })
      return pos
    },
    // 返回当前地址所在部分的列表成员
    listManage: function () {
      return this.list[this.pageManage]
    }
  }, methods: {
    // 判断应该显示登入还是登出
    log () {
      if (this.pageManage === 1) {
        this.$emit('logout')
      } else {
        this.$emit('login')
      }
    },
    // 对名字部分进行处理
    nameManage: function () {
      const name = this.user[0]
      const vowelList = ['a', 'e', 'i', 'o', 'u']
      if (this.pageManage === 0) {
        if (vowelList.indexOf(name.slice(0, 1)) !== -1) {
          this.user[0] = 'An ' + name.slice(0, 1).toUpperCase() + name.slice(1) + '\'s Pen'
        } else {
          this.user[0] = 'A ' + name.slice(0, 1).toUpperCase() + name.slice(1) + '\'s Pen'
        }
      } else {
        this.user[0] = name.slice(0, 1).toUpperCase() + name.slice(1)
      }
    }
  }, mounted () {
    const _this = this
    this.$reqs.post('/users/information', {}).then(result => {
      _this.user = [result.data.name, result.data.signature]
      _this.imgsrc = result.data.imgsrc
      _this.nameManage()
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>

<style scoped>
#avatar {
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  display: inline-block;
  border-radius: 50%;
  background-color: black;
  margin: 20px 0;
  object-fit: cover;
}

aside h1 {
  font-size: 45px;
  font-weight: lighter;
}

aside h1 > a {
  color: white;
}

aside span {
  color: #666666;
  margin: 25px 0;
  display: block;
}
aside li {
  list-style: none;
}
aside li > a {
  margin: 5px 0;
  color: white;
  display: inline-block;
  font-weight: lighter;
}

aside li > a:hover {
  text-decoration: underline;
}
</style>