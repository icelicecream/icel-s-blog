<template>
  <section class="arrow">
    <a class="previous"
       :href="'./essay?id='+prev"
       v-if='prev'>&#8592; Older Post</a>
    <a class="next"
       :href="'./essay?id='+next"
       v-if='next'>Next Post &#8594;</a>
  </section>
</template>

<script>
export default {
  data () {
    return {
      prev: '',
      next: ''
    }
  },
  mounted () {
    const _this = this
    this.$reqs.post('/users/list', { hide: false, delete: false }).then(result => {
      const reslist = result.data
      reslist.map((val, index) => {
        if (val.uniqid === _this.$route.query.id) {
          _this.prev = (index - 1) < 0 ? '' : reslist[index - 1].uniqid
          _this.next = (index + 1) === reslist.length ? '' : reslist[index + 1].uniqid
        }
      })
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>

<style scoped>
.arrow {
  height: 30px;
  line-height: 30px;
  margin: 50px auto 10px;
}

.previous {
  float: left;
  color: black;
  transition: color 0.5s;
}

.next {
  float: right;
  color: black;
  transition: color 0.5s;
}

.previous:hover,
.next:hover {
  color: #999;
}
</style>