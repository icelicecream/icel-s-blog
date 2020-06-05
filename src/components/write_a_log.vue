<template>
  <article>
    <h1>Write a log</h1>
    <div id="main-box">
      <div id="title">
        <span>title:</span>
        <input type="text"
               placeholder="title"
               v-model='title' /></div>
      <div id="tag">
        <span>tags:</span>
        <input type="text"
               placeholder="tag (eg.#javascript#java)"
               v-model="tags" /></div>
      <div id="subtitle">
        <span>subtitle:</span>
        <input type="text"
               placeholder="subtitle"
               v-model="subtitle" />
      </div>
      <div id='editor'>
        <mavon-editor style="height: 100%; width: 100%;"
                      v-model="value"
                      @imgAdd='imgAdd'
                      @imgDel='imgDel'
                      :toolbars='toolbars'
                      ref='md'
                      :subfield='false'
                      :boxShadow='false'></mavon-editor>
      </div>

      <div id="button">
        <span id='preview'
              @click='preview = true'>preview</span>
        <span id="save"
              @click="update ? updateArticle() : addArticle()">save</span>
      </div>
    </div>
    <preview-article :value='value'
                     v-if='preview'
                     @closePreview='preview = false'></preview-article>
  </article>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import previewArticle from './preview'
export default {
  components: {
    mavonEditor, previewArticle
  },
  data () {
    return {
      uniqid: '',
      title: '',
      tags: '',
      subtitle: '',
      value: '', // mavonEditor的v-model监视value
      update: false,
      configs: {
        autofocus: true,
        forceSync: true,
        renderingConfig: {
          codeSyntaxHighlighting: true
        }
      },
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: false, // 下划线
        strikethrough: true, // 中划线
        mark: false, // 标记
        superscript: false, // 上角标
        subscript: false, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: false, // 展示html源码
        help: false, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: false, // 下一步
        trash: false, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: false, // 导航目录
        /* 2.1.8 */
        alignleft: false, // 左对齐
        aligncenter: false, // 居中
        alignright: false, // 右对齐
        /* 2.2.1 */
        subfield: false, // 单双栏模式
        preview: false, // 预览
        boxShadow: false
      },
      preview: false
    }
  }, methods: {
    addArticle () {
      const inputObj = document.getElementsByTagName('input')
      const title = this.title // 标题
      const tags = this.tags.split('#').slice(1) // 标签
      const subtitle = this.subtitle // 副标题
      const article = this.value // 文章
      // 防止没有标题，标签和副标题的情况下提交
      if (!title && tags.length === 0 && !subtitle) {
        return false
      }
      this.$reqs.post('/users/saveArticle', { "title": title, "subtitle": subtitle, "tags": tags, "article": article }).then(result => {
        if (result.data.success === true) {
          // 保存成功
          console.log('保存成功')
          window.location.href = './console'
        } else {
          // 保存失败
          console.log('保存失败')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    updateArticle () {
      const inputObj = document.getElementsByTagName('input')
      const title = this.title // 标题
      const tags = this.tags.split('#').slice(1) // 标签
      const subtitle = inputObj[2].value // 副标题
      const article = this.value // 文章
      const wherestr = { "uniqid": this.uniqid }
      const updatestr = { $set: { "title": title, "subtitle": subtitle, "tags": tags } }
      console.log(wherestr)
      console.log(updatestr)
      this.$reqs.post('/users/updateArticle', { update: [wherestr, updatestr], article: article }).then(result => {
        console.log(result)
        if (result.data.success === true) {
          // 保存成功
          console.log('保存成功')
          window.location.href = './console'
        } else {
          // 保存失败
          console.log('保存失败')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    imgAdd (pos, file) {
      // console.log(pos)
      // console.log(file)
      // 第一步.将图片上传到服务器.
      const _this = this
      let formdata = new FormData()
      formdata.append('imgFile', file)
      this.$reqs.post('/users/image', formdata).then(result => {
        // 替换掉当前的url
        _this.$refs.md.$img2Url(pos, result.data.url)
      }).catch(error => console.log(error))
    },
    imgDel (data) {
      const filename = data[0].match(/images\/(.*)/)[1]
      console.log(filename)
      this.$reqs.post('/users/deleteImage', { filename: filename }).then(result => {
        console.log(result)
        if (result.data.success) {
          console.log('图片已删除')
        } else {
          console.log(result.data.error)
        }
      }).catch(error => console.log(error))
    }
  }, mounted () {
    const _this = this
    if (this.$route.query.id && this.$route.query.id !== '') {
      // 文章修改
      const id = this.$route.query.id
      this.$reqs.post('/users/findArticle', { uniqid: id }).then(result => {
        if (result.data.article) {
          _this.title = result.data.title
          _this.tags = '#' + result.data.tags.join('#')
          _this.subtitle = result.data.subtitle
          _this.value = result.data.article.data
          _this.uniqid = id
          _this.update = true
        } else {
          console.log('文章获取失败')
          window.location.href = './writeALog'
        }
      }).catch(error => console.log(error))

    } else if (this.$route.query.id === '') {
      window.location.href = './writeALog'
    }
  }, watch: {
    '$route' (newPath, oldPath) {
      if (newPath.query !== oldPath.query) {
        window.location.href = newPath.fullPath
      }
    }
  }
}
</script>

<style scoped>
@import '../../static/markdown.css';

#main-box {
  margin: 40px;
  padding: 50px;
  border: 1px solid black;
  box-sizing: border-box;
  font-size: 20px;
  font-weight: lighter;
}

#main-box > div {
  margin-bottom: 10px;
}

#main-box > div > span {
  font-size: 25px;
  margin-bottom: 10px;
}

#main-box > div > input {
  width: 100%;
  height: 23px;
  border: 0;
  outline: none;
  border-bottom: 1px solid black;
  font-size: 20px;
  line-height: 23px;
}

#textarea {
  margin-top: 20px;
}

#textarea::-webkit-scrollbar {
  width: 0;
}

#textarea::-webkit-scrollbar-track {
  background-color: transparent;
}

#textarea::-webkit-scrollbar-thumb {
  background-color: transparent;
}

#main-box > #button {
  margin: 10px auto 0;
  text-align: right;
  font-size: 0;
}

#button > span {
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

#button > span:hover {
  background-color: black;
  color: white;
}
</style>