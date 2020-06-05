<template>
  <div id="mask">
    <div class='article'>
      <h1>preview</h1>
      <div id='preview-box'>
        <div class='markdown-body'
             v-html="msg"></div>
      </div>
      <span id='close'
            @click="close">×</span>
    </div>
  </div>
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
export default {
  props: ['value', 'uniqid'],
  data () {
    return {
      msg: ''
    }
  }, methods: {
    close () {
      this.$emit('closePreview')
    }
  }, mounted () {
    if (this.value) {
      this.msg = marked(this.value)
    } else if (this.uniqid) {
      // console.log(this.uniqid)
      const uniqid = this.uniqid
      const _this = this
      this.$reqs.post('users/findArticle', { uniqid: uniqid }).then(result => {
        if (result.data.article) {
          _this.msg = marked(result.data.article.data)
          console.log(result.data)
        } else {
          console.log('无法查询到文章')
        }
      }).catch(error => console.log(error))
    }
  }
}
</script>

<style scoped>
#mask {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1600;
  background-color: transparent;
  padding: 50px;
  box-sizing: border-box;
  left: 0;
  top: 0;
}
.article {
  width: 80%;
  height: 90%;
  margin: 50px auto;
  padding: 50px;
  box-sizing: border-box;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  overflow: auto;
  background-color: white;
}

.article > h1 {
  font-size: 40px;
  display: block;
  margin: 0 0 10px;
  font-weight: lighter;
}

.article::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

.article::-webkit-scrollbar-track {
  background-color: transparent;
}

.article::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 1.5px;
  border-radius: 1.5px;
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

#preview-box {
  text-align: left;
  font-weight: lighter;
  width: 80%;
  padding: 50px;
  margin: 20px auto 40px;
  box-sizing: border-box;
}
</style>