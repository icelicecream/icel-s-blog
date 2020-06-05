<template>
  <article>
    <em class='em-style'>Recent Articles</em>
    <section v-for="item in list"
             v-if='item.hide === false'>
      <router-link :to="'./essay?id=' + item.uniqid">
        <h1>{{ item.title }}</h1>
        <h2>{{ item.subtitle }}</h2>
      </router-link>
    </section>
    <em class='em-style'>This Is The Bottom</em>
  </article>
</template>

<script>

export default {
  data () {
    return {
      list: []
    }
  }, mounted () {
    const _this = this
    this.$reqs.post('/users/list', { hide: false, delete: false }).then(result => {
      // console.log(result)
      _this.list = result.data.reverse()
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>

<style scoped>
article {
  text-align: center;
}

article > section {
  min-height: 200px;
  width: 90%;
  margin: 0 auto;
  border-bottom: 1px solid #ddd;
  color: black;
  flex-direction: column;
  padding: 40px 0;
  box-sizing: border-box;
}

section > a {
  color: black;
  text-decoration: none;
}

article > section:nth-last-child(2) {
  /* 最后一篇文章底部样式 */
  border: 0;
}

article > section:hover {
  opacity: 0.7;
}

section h1 {
  font-size: 40px;
  font-weight: lighter;
  margin-bottom: 50px;
}

section h2 {
  font-size: 15px;
  font-weight: lighter;
}
</style>