<template>
  <div class="comment-box">
    <h1 v-if='title'>Comments</h1>
    <input type="text"
           v-model='name'
           placeholder="username"
           class='username'>
    <textarea id='comment'
              v-model="commentValue"
              placeholder="comment"
              autocomplete=”off”></textarea>
    <div class="button">
      <div @click="saveComment">release</div>
    </div>

  </div>
</template>

<script>

export default {
  props: ['floor', 'reply', 'title'],
  data () {
    return {
      commentValue: '',
      name: ''
    }
  }, methods: {
    saveComment () {
      const _this = this
      if (this.name === '' || this.commentValue === '') {
        return false; // 未写用户名或者内容
      }
      this.$reqs.post('/users/savecomments', {
        name: this.name,
        reply: this.reply ? this.reply : 0,
        value: this.commentValue,
        floor: this.floor + 1,
        articleId: this.$route.query.id
      }).then(result => {
        console.log(result)
        if (result.data.success === false) {
          console.log('评论保存失败')
        } else {
          // 保存成功
          console.log(_this.$route.fullPath)
          window.location.href = _this.$route.fullPath
        }
      }).catch(error => console.log(error))
    }
  }, mounted () {

  }
}
</script>

<style scoped>
.comment-box {
  text-align: center;
}

.comment-box h1 {
  font-size: 40px;
  margin: 20px 0;
  font-weight: lighter;
  text-align: left;
}
.comment-box .button {
  height: 35px;
  padding: 15px 0;
  text-align: right;
}

.comment-box .button > div {
  display: inline-block;
  width: 160px;
  font-size: 25px;
  font-weight: lighter;
  cursor: pointer;
  background-color: transparent;
  box-sizing: border-box;
  text-align: center;
  transition: background-color, color 0.5s;
}

.comment-box .button > div:hover {
  background-color: black;
  color: white;
}

.username {
  font-size: 20px;
  text-align: left;
  width: 90%;
  outline: none;
  border: 0;
  box-shadow: 0 0 2px black;
  box-sizing: border-box;
  padding: 5px 20px;
  margin: 10px 0;
  background-color: transparent;
}

textarea {
  height: 100px;
  width: 90%;
  overflow: auto;
  text-align: left;
  border: 0;
  box-shadow: 0 0 2px black;
  font-size: 20px;
  box-sizing: border-box;
  padding: 20px;
  resize: none;
  outline: none;
  margin-top: 10px;
  background-color: transparent;
}

textarea:focus,
.username:focus {
  box-shadow: 0 0 2px black inset;
}

textarea::-webkit-scrollbar {
  width: 3px;
  border-radius: 50%;
}

textarea::-webkit-scrollbar-track {
  background-color: transparent;
}

textarea::-webkit-scrollbar-thumb {
  background-color: black;
}
</style>