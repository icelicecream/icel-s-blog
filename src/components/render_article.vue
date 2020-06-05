<template>
  <section>
    <div id="essay-title">{{ title }}</div>
    <div id="essay-tags">
      <router-link v-for="(tagName,index) in tags"
                   :to="'./articles?tag=' + tagName"
                   :key='index'>&nbsp;&nbsp;#{{ tagName }}</router-link>
    </div>
    <div id='main-box'>
      <div class='markdown-body'
           v-html="msg"></div>
    </div>
    <div id="essay-date">{{ createTime }}</div>
  </section>
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/monokai-sublime.css'
// ==================== marked设置 ========================

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code) {
    return hljs.highlightAuto(code).value
  },
  gfm: true, // 启动github样式的markdown
  tables: true, // 支持github表格
  breaks: true, // 支持github换行符
  pedantic: false, // 只解析符合markdown.pl定义的,不修正markdown错误 
  sanitize: false, // 原始输出，忽略html标签
  smartLists: true, // 优化表格输出
  smartypants: true // 使用更时髦的标点，比如在引用语法中加入破折号
})

// ==================== marked设置 ========================
export default {
  data () {
    return {
      title: '',
      tags: [],
      createTime: '',
      msg: ''
    }
  }, mounted () {
    if (this.$route.query.id) {
      const _this = this
      const uniqid = this.$route.query.id
      this.$reqs.post('users/findArticle', { uniqid: uniqid }).then(result => {
        if (result.data.article) {
          _this.msg = marked(result.data.article.data)
          _this.title = result.data.title
          _this.tags = result.data.tags
          _this.createTime = result.data.createTime
          console.log(result.data)
        } else {
          console.log('无法查询到文章')
        }
      }).catch(error => console.log(error))
    } else {
      window.location.href = './home'
    }
  }
}
</script>

<style scoped>
section {
  padding: 50px;
  box-sizing: border-box;
  width: 100%;
}
#main-box {
  text-align: left;
  font-weight: lighter;
  padding: 0 5%;
  /* white-space: pre-wrap; 如果保留每行前空格，会导致li行间距变大*/
}

#main-box img {
  width: 60%;
  height: 60%;
}

#essay-title {
  font-size: 45px;
  font-weight: lighter;
  text-align: center;
}

#essay-tags,
#essay-date {
  text-align: right;
  font-size: 15px;
  margin: 15px 0;
  font-weight: lighter;
}

#essay-tags > a {
  color: black;
  transition: color 0.5s;
}

#essay-tags > a:hover {
  color: #999;
}

.markdown-body iframe {
  width: 100%;
  margin: 0 auto;
}
</style>