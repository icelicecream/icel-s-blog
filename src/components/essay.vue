<template>
  <article>
    <render-article />
    <change-page />
    <footer>
      <reply-box :floor='floor'
                 :title='true'></reply-box>
      <all-comments @floor='getFloor'></all-comments>
    </footer>
  </article>
</template>

<script>
import renderArticle from './render_article'
import changePage from './change_page'
import replyBox from './reply_box'
import allComments from './comments'
export default {
  components: {
    renderArticle, changePage, replyBox, allComments
  }, data () {
    return {
      floor: 0
    }
  }, methods: {
    // 从comments组件获取当前楼层数，保存到本插件的this.floor中
    getFloor (data) { this.floor = data }
  }, mounted () {
    if (!this.$route.query || !this.$route.query.id) {
      window.location.href = './home'
    }
  }
}
</script>

<style scoped>
footer {
  min-height: 100px;
  border-top: 1px solid #ddd;
  padding-bottom: 20px;
}

footer h1 {
  font-size: 40px;
  margin: 20px 0;
  font-weight: lighter;
  text-align: left;
}
</style>