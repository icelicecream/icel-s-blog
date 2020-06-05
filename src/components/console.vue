<template>
  <article>
    <h1>Console</h1>
    <ul id="article-list">
      <li v-for='(page, index) in showlist'
          :class="page.hide? 'isHide':''">
        <span>{{ page.title }}</span>
        <div class="button">
          <span @click="isPreview(page.uniqid)">preview</span>
          <router-link :to="'./writeALog?id=' + page.uniqid"
                       :class="page.hide ? 'hideBtn':''"
                       tag='span'>revise</router-link>
          <span :class="page.hide ? 'hideBtn':''"
                @click="listProcess('hide', index)">hide</span>
          <span :class="page.hide ? 'hideBtn':''"
                @click="listProcess('delete',index)">delete</span>
        </div>
      </li>
    </ul>
    <div id="page"
         v-if='list.length !== 0'>
      <ul>
        <li id="previous"
            @click="pageUp"
            v-if='totalPage>1'>&#8592;</li>
        <li v-for="index in createPageTagList()"
            :class="pageNum === index ? 'checked': ''"
            @click="changePage(index)">{{ index }}</li>
        <li id="next"
            @click="pageDown"
            v-if='totalPage>1'>&#8594;</li>
      </ul>
    </div>
    <!-- 预览文章渲染情况 -->
    <preview-article v-if="preview"
                     :uniqid='previewId'
                     @closePreview='preview = false'></preview-article>
    <em class='empty'
        v-if='list.length === 0'>Article List Is Empty</em>
  </article>
</template>

<script>
import previewArticle from './preview'
export default {
  components: {
    previewArticle
  },
  data () {
    return {
      list: [], // 存储列表
      showlist: [], // 当前显示页的列表
      pageNum: 1, // 记录当前页
      preview: false,
      previewId: ''
    }
  },
  computed: {
    articleNum () {
      // 计算列表数量
      return this.list.length
    },
    totalPage () {
      // 计算最大页数
      return Math.ceil(this.articleNum / 10)
    },
    changeList () {
      // 换页
      return this.list.slice((this.pageNum - 1) * 10, this.pageNum * 10)
    }
  },
  methods: {
    // 上一页
    pageUp: function () {
      if (this.pageNum === 1) {
        return false
      }
      this.pageNum -= 1
      this.showlist = this.changeList // 重新计算当前页应该显示的信息
    },
    // 下一页
    pageDown () {
      if (this.pageNum === this.totalPage) {
        return false
      }
      this.pageNum += 1
      this.showlist = this.changeList // 重新计算当前页应该显示的信息
    },
    // 创建翻页用的标签列表
    createPageTagList () {
      let pageListArr = []
      if (this.totalPage <= 3) {
        for (let i = 0; i < this.totalPage; i++) {
          pageListArr.push(i + 1)
        }
      } else {
        pageListArr = [this.pageNum - 1, this.pageNum, this.pageNum + 1]
        if (this.pageNum === 1) {
          pageListArr = pageListArr.map(val => val + 1)
        }
        if (this.pageNum === this.totalPage) {
          pageListArr = pageListArr.map(val => val - 1)
        }
      }

      return pageListArr
    },
    // 更换页
    changePage (num) {
      this.pageNum = num
    },
    deleteArticle (num) {
      // 删除文章时翻页用的标签列表需要跟着更新
      // this.list.splice((this.pageNum - 1) * 10 + num, 1)
      const _this = this
      const pos = (this.pageNum - 1) * 10 + num
      const uniqid = this.list[pos].uniqid
      const whereStr = { "uniqid": uniqid }
      const updateStr = { $set: { "delete": true } }
      this.$reqs.post('users/updateList', [whereStr, updateStr]).then(result => {
        if (result.data.success === true) {
          _this.list.splice(pos, 1) // 假列表中的对应数据删除
          _this.showlist = _this.changeList // 重新计算当前页应该显示的信息
        } else {
          console.log('Article deletion failed')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 隐藏文章
    hideArticle (num) {
      const _this = this
      const pos = (this.pageNum - 1) * 10 + num
      const uniqid = this.list[pos].uniqid
      const hideStatus = this.list[pos].hide
      const whereStr = { "uniqid": uniqid } // 查询条件
      const updateStr = { $set: { "hide": !hideStatus } }
      this.$reqs.post('/users/updateList', [whereStr, updateStr]).then(result => {
        if (result.data.success === true) {
          _this.list[pos].hide = !hideStatus
        } else {
          console.log('Style change failed')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    listProcess (method, num) {
      switch (method) {
        case 'delete': this.deleteArticle(num)
          return false
        case 'hide': this.hideArticle(num)
          return false
        default: return false
      }
    },
    isPreview (id) {
      this.previewId = id
      this.preview = true
    }
  },
  mounted () {
    const _this = this
    this.$reqs.post('/users/list', { delete: false }).then(result => {
      _this.list = result.data.reverse()
      _this.showlist = _this.changeList
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
  min-width: 410px;
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

#page {
  text-align: center;
  margin-top: 100px;
  margin-bottom: 50px;
  font-size: 0;
}

#page > ul > li {
  display: inline-block;
  width: 90px;
  height: 35px;
  font-size: 23px;
  font-weight: lighter;
  line-height: 35px;
  text-align: center;
  border-right: 1px solid black;
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color, color 0.5s;
  user-select: none; /* 防止文字被选中 */
}

#page > ul > li:last-child {
  border-right: 0;
}

#page > ul > li:hover {
  background-color: black;
  color: white;
}

#page .checked,
.isHide {
  background-color: black;
  color: white;
}

#page .checked:hover,
.button .hideBtn:hover {
  background-color: white;
  color: black;
}

.empty {
  color: #666666;
  display: block;
  text-align: center;
  font-size: 20px;
  font-weight: lighter;
}
</style>