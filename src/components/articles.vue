<template>
  <article>
    <h1>{{ title }}</h1>
    <section v-for='time in list'>
      <h2>{{time.year}}</h2>
      <ul>
        <li v-for='page in time.pages'>
          <router-link :to="'./essay?id=' + page.uniqid">{{ page.title }}</router-link>
          <span v-if='page.tags.length !== 0'>&nbsp;&#8722;&nbsp;</span>
          <router-link v-for='(tag, tagindex) in page.tags'
                       :to="'./articles?tag=' + tag"
                       :key="tagindex">&nbsp;{{ '#' + tag }}&nbsp;</router-link>
        </li>
      </ul>
    </section>
  </article>
</template>

<script>
export default {
  data () {
    return {
      title: 'Articles',
      list: []
    }
  }, mounted () {
    const _this = this
    this.$reqs.post('/users/list', { hide: false, delete: false }).then(result => {
      let dataList = result.data.reverse()
      // =======================可以将这部分代码放到服务器端，由服务器进行处理============================
      if (_this.$route.query.tag) {
        // 需要通过tag进行数据筛选时
        const tag = _this.$route.query.tag
        _this.title = "tag:" + tag
        // 筛选出符合要求的数据
        dataList = dataList.filter(val => {
          if (val.tags.indexOf(tag) !== -1) {
            return val
          }
        })
      }
      let outputList = [] // 最终输出用的列表
      let yearList = [] // 同步保存年份来生成输出用列表
      dataList.map(val => {
        const year = val.createtime.match(/(\d{4})-\d{2}-\d{2}/)[1]
        if (yearList.indexOf(year) === -1) {
          yearList.push(year)
          outputList.push({ year: year, pages: [{ title: val.title, tags: val.tags, uniqid: val.uniqid }] })
        } else {
          outputList[yearList.indexOf(year)].pages.push({ title: val.title, tags: val.tags, uniqid: val.uniqid })
        }
      })
      _this.list = outputList
      // =============================================================================================
    }).catch(error => { // 处理promise处理被拒绝的情况
      console.log(error)
    })
  }, watch: {
    '$route' (newPath, oldPath) {
      // 监听$route 如果地址栏有变化，帮助页面进行跳转更新页面
      if (newPath.query !== oldPath.query) {
        window.location.href = newPath.fullPath
      }
    }
  }
}
</script>

<style scoped>
article > section {
  padding: 10px 0;
}

section > h2 {
  font-size: 30px;
  display: block;
  margin-bottom: 5px;
  font-weight: lighter;
}

section > ul > li {
  padding: 3px 0;
  font-weight: lighter;
  list-style: none;
}

section > ul > li > a {
  color: black;
  transition: color 0.5s;
}

section > ul > li > a:hover {
  color: #999;
}
</style>