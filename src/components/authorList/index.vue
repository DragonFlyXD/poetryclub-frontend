<template lang="html">
  <div class="df-authorList">
    <div class="box"
      v-for="(author, index) in authors"
      v-if="authors.length > 0"
      :key="index"
    >
      <div class="main">
        <router-link class="title tdu" :to="{ path: author.profileUrl }">{{ author.nickname }}</router-link>
        <p class="signature" v-if="author.signature">{{ author.signature }}</p>
        <p class="signature empty" v-else>空空如也~</p>
        <div class="meta">
          <router-link :to="{ path: `/user/${author.name}/works` }">
            <span>{{ author.works_count }}</span>作品
          </router-link>
          <router-link :to="{ path: `/user/${author.name}/followers` }">
            <span>{{ author.followers_count }}</span>关注
          </router-link>
          <router-link class="last" :to="{ path: `/user/${author.name}/followings` }">
            <span>{{ author.followings_count }}</span>粉丝
          </router-link>
        </div>
      </div>
      <router-link :to="{ path: author.profileUrl }">
        <img :src="author.avatar" alt="avatar" class="avatar">
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'authorList',
  props: ['authors']
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-authorList
  .box
    fj(space-between)
    padding 10px 5px
    border-bottom 1px solid Extra-Light-Grey
    .main
      width 80%
      .title
        font-size .8em
      .signature
        overflow hidden
        font-size .9em
        text-overflow ellipsis
        white-space nowrap
        color Silver
      .empty
        color Grey
      .meta
        a
          font-size .7em
          text-decoration none
          color Silver
          &:hover
            color Red
          &::after
            content '\2726'
        .last::after
          content ''
        span
          margin-right 5px
    .avatar
      wh(40px,40px)
      border-radius 40px
</style>
