<template lang="html">
  <div class="df-blankArea">
    <div class="content" ref="content">
      <p class="cry">{{ cry }}</p>
      <p class="hint">{{ hint }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'blankArea',
  props: {
    cry: {
      type: String,
      default: '~~\\(ㄒoㄒ)/~~'
    },
    hint: {
      type: String,
      default: '无人深空'
    }
  },
  mounted() {
    this.$refs['content'].style.animation = 'showHint 3s cubic-bezier(1,.5,.8,1)'
  }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/common"

.df-blankArea
  fj(center)
  .content
    color Light-Silver
    text-shadow 1px 1px 1px Light-Silver
    .cry
      font-size 2em
      &::before
        font(2em,Light-Silver)
        content: '\201C'
      &::after
        font(2em,Light-Silver)
        content: '\201D'
    .hint
      font-size 1.5em
      letter-spacing 1.5em
      &::before
        font(2em,Light-Silver)
        content '\5B'
      &::after
        font(2em,Light-Silver)
        content '\5D'
</style>
