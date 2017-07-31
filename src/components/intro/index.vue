<template lang="html">
  <div class="df-intro">
    <div class="intro-left">
      <h2 class="title">{{ intro.title }}</h2>
      <div class="body">
        <p class="content">{{ intro.content }}</p>
      </div>
    </div>
    <div class="intro-right">
      <i class="icon" :class="intro.icon"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'intro',
  props: {
    intro: {
      type: Object,
      default: {}
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-intro
  fj(space-around)
  margin-bottom 30px
  background-color Dark-White
  .intro-left
    width 50%
    .title
      color Green
      &::before
        margin-right 20px
        content '\5B'
      &::after
        margin-left 20px
        content '\5D'
    .body
      line-height 2em
      color Silver
      .content
        &::before
          margin-right 20px
          font(2em,Green)
          content '\201C'
        &::after
          margin-left 20px
          font(2em,Green)
          content '\201D'
  .intro-right
    width 12.5%
    margin-top 50px
    text-align center
    .icon
      font(8em,Green)
      cursor pointer
      &:hover
        animation tfIcon 4s ease
</style>
