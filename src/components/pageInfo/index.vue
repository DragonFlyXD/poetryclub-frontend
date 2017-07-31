<template lang="html">
  <div class="df-pageInfo">
    <div class="main">
      <p><i class="fa fa-eye"></i><span>{{ page.pageviews_count }}</span></p>
      <p><i class="fa fa-clock-o"></i><span>{{ page.publish_time }}</span></p>
      <p><i class="fa fa-heart"></i><span>{{ page.favorites_count }}</span></p>
      <p><i class="fa fa-pencil-square"></i><span>{{ page.appreciations_count }}</span></p>
      <p><i class="fa fa-thumbs-up"></i><span>{{ page.likes_count }}</span></p>
      <p><i class="fa fa-share-square"></i><span>{{ page.shares_count }}</span></p>
    </div>
    <div class="rate">
      <el-rate
        show-text
        text-color="#42b983"
        v-model="status.rating"
        :colors="['rgba(66,185,131,.5)','rgba(66,185,131,.8)','#42b983']"
        disabled
      ></el-rate>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pageInfo',
  props: {
    page: {
      type: Object,
      default: {}
    },
    status: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-pageInfo
  margin 10px 0 40px 0
  .main
    &>p
      color Green
      &>span
        font-size .8em
      &>i
        margin-right 10px
        color Light-Green
</style>
