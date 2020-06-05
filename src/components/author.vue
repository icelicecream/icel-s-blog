<template>
  <article>
    <h1>Author</h1>
    <div id="introduce">
      <div><img :src="user.imgsrc"
             alt="author"
             id="author" /></div>
      <h1>{{ user.name }}</h1>
      <p>{{ user.introduce }}</p>
      <p>{{ user.email }}</p>
    </div>
  </article>
</template>

<script>
export default {
  data () {
    return {
      user: {}
    }
  }, mounted () {
    const _this = this
    this.$reqs.post('/users/information', {}).then(result => {
      _this.user = result.data
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
#author {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background-color: white;
  margin-top: 50px;
  margin-bottom: 20px;
  box-shadow: 0 0 5px black;
  object-fit: cover;
}

#introduce > h1 {
  font-size: 40px;
  font-weight: lighter;
}

#introduce > p {
  font-size: 20px;
  font-weight: lighter;
  padding: 15px 0;
}
</style>