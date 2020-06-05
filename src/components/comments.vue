<template>
  <div id="all-comments">
    <h1>All Comments</h1>
    <em v-if="!hasComments"
        class='em-style'>No related comments</em>
    <section v-for="value in commentsTree">
      <span class="name">{{ commentsList[value.pos].name }}</span>
      <span class='floor'>#{{ commentsList[value.pos].floor }}</span>
      <span class="time">{{ commentsList[value.pos].time }}</span>
      <p class='content'>{{ commentsList[value.pos].content }}</p>
      <div class='reply'
           @click='changeReply($event)'>reply</div>
      <replyBox class="hide"
                :title='false'
                :reply='commentsList[value.pos].floor'
                :floor='floor'></replyBox>
      <div class="reply-to"
           v-if="value.isArray">
        <section v-for='replyIndex in value.reply'>
          <span class="name">{{ commentsList[replyIndex].name }}</span>
          <span class='floor'>#{{ commentsList[replyIndex].floor }}</span>
          <span class="time">{{ commentsList[replyIndex].time }}</span>
          <p class='content'>{{ commentsList[replyIndex].content }}</p>
          <div class='reply'
               @click='changeReply($event)'>reply</div>
          <reply-box class="hide"
                     :title='false'
                     :reply='commentsList[replyIndex].floor'
                     :floor='floor'></reply-box>
        </section>
      </div>
    </section>
    <em v-if="hasComments"
        class='em-style'>This Is The Bottom</em>
  </div>
</template>
<!--重复生成大量没有用的replyBox，需要优化-->
<script>
import replyBox from './reply_box'
export default {
  components: { replyBox },
  data () {
    return {
      pos: 0,
      configs: {
        spellChecker: false,
        minHeight: 400
      },
      commentsList: [],
      commentsTree: [],
      floor: 0,
      hasComments: true
    }
  }, methods: {
    // 显示和隐藏其他的reply-box
    changeReply (event) {
      const allBox = document.getElementsByClassName('comment-box')
      const allreply = document.getElementsByClassName('reply')
      for (let j = 0; j < allreply.length; j++) {
        allreply[j].classList.remove('hide')
      }
      for (let i = 0; i < allBox.length; i++) {
        allBox[i].classList.add('hide')
      }
      const thisComment = event.currentTarget.parentNode.getElementsByClassName('comment-box')[0]
      thisComment.classList.toggle('hide')
      event.target.classList.toggle('hide')
    }
  }, mounted () {
    const _this = this
    this.$reqs.post('/users/comments', { articleid: this.$route.query.id }).then(result => {
      if (result.data.success === false) {
        // 没有找到这篇文章的评论
        _this.hasComments = false
        _this.$emit('floor', 0) // 帮助设置新评论的楼层数
      } else {
        _this.commentsList = result.data.commentslist // 获取评论列表
        _this.commentsTree = result.data.commentstree // 获取评论树
        _this.floor = result.data.commentslength
        _this.$emit('floor', result.data.commentslength) // 帮助设置新评论的楼层数
      }

    }).catch(error => {
      console.log(error)
    })
  }
}
</script>

<style scoped>
#all-comments {
  border-top: 1px solid #ddd;
}

#all-comments > h1 {
  font-size: 40px;
  margin: 20px 0;
  font-weight: lighter;
  text-align: left;
}

#all-comments section {
  padding: 20px;
  border-bottom: 1px solid #ddd;
  text-align: right;
}

#all-comments section:last-child {
  /* 最后一条回复底部样式 */
  border-bottom: 0;
}

#all-comments section > span {
  font-size: 20px;
  font-weight: lighter;
  text-indent: 1em;
}

.name {
  float: left;
}

.floor,
.time {
  float: right;
}

.content {
  width: 90%;
  display: block;
  font-weight: lighter;
  text-align: left;
  margin: 40px auto 10px;
  white-space: pre-wrap;
}

section section {
  background-color: #eee;
}

.reply,
.comment-reply {
  display: inline-block;
  width: 160px;
  font-weight: lighter;
  cursor: pointer;
  background-color: transparent;
  box-sizing: border-box;
  text-align: center;
  transition: background-color, color 0.5s;
  font-size: 20px;
  margin: 10px 0;
}

.reply-content {
  font-size: 20px;
  width: 80%;
  height: 25px;
  line-height: 25px;
  outline: none;
  border: 1px solid #ddd;
  box-sizing: border-box;
  padding: 0 10px;
  margin: 0 10px;
}

.reply:hover,
.comment-reply:hover {
  background-color: black;
  color: white;
}

.hide {
  display: none;
}
</style>