<template>
  <article>
    <h1>Recycle Bin</h1>
    <ul id="article-list">
      <li v-for='(page, index) in list'>
        <span>{{ page.title }}</span>
        <div class="button">
          <span @click='restoreArticle(page.uniqid,index)'>restore</span>
          <span @click="deleteArticle(page.uniqid,page.title,index)">delete</span>
        </div>
      </li>
    </ul>
    <em v-if='list.length === 0'
        class='em-style'>Recycle Bin Is Empty</em>
  </article>
</template>

<script>
export default {
  data () {
    return {
      list: [],
    }
  },
  methods: {
    restoreArticle (uniqid, index) {
      const _this = this
      const whereStr = { uniqid: uniqid }
      const updateStr = { $set: { delete: false } }
      this.$reqs.post('/users/updateList', [whereStr, updateStr]).then(result => {
        if (result.data.success === true) {
          console.log('restore true')
          _this.list.splice(index, 1)
        } else {
          console.log('restore false')
        }
      }).catch(error => console.log(error))
    },
    // 该删除操作会删除服务端上保存的文章，不可逆
    deleteArticle (uniqid, title, index) {
      const _this = this
      this.$reqs.post('/users/deleteList', { uniqid: uniqid, title: title }).then(result => {
        if (result.data.success === true) {
          console.log('delete true')
          _this.list.splice(index, 1)
        } else {
          console.log('delete false')
        }
      }).catch(error => console.log(error))
    }
  },
  mounted () {
    const _this = this
    this.$reqs.post('/users/list', { delete: true }).then(result => {
      console.log(result)
      _this.list = result.data.reverse()
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>

<style scoped>
#article-list {
  margin: 100px 30px;
}

#article-list > li {
  padding: 5px 0;
  user-select: none;
  list-style: none;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
}

#article-list > li > span {
  font-size: 23px;
  font-weight: lighter;
  margin: 0 10px;
  max-width: 750px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 410px;
}

.button {
  float: right;
  font-size: 0;
  align-self: flex-end;
  min-width: 200px;
}

.button > span {
  display: inline-block;
  width: 80px;
  font-size: 23px;
  font-weight: lighter;
  text-align: center;
  padding: 0 10px;
  cursor: pointer;
  transition: background-color, color 0.5s;
}

.button > span {
  border-right: 1px solid black;
}

.button > span:last-child {
  border-right: 0;
}

.button > span:hover {
  background-color: black;
  color: white;
}
</style>