<template lang="html">
  <div class="df-backToTop" v-show="b2TVisible" @click="back">
    <i class="fa fa-arrow-up"></i>
  </div>
</template>

<script>
export default {
  name: 'backToTop',
  data() {
    return {
      b2TVisible: false,
      // 滚动步长
      step: 50
    }
  },
  created() {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > window.innerHeight + 100) {
        this.b2TVisible = true
      } else {
        this.b2TVisible = false
      }
    })
  },
  methods: {
    back() {
      setTimeout(() => {
        // 当前顶部距离
        let currentTop = document.body.scrollTop
        // 滚动距离
        let dist = Math.floor(-currentTop / this.step)
        // 滚动目的地
        let nextTop = currentTop + dist
        if (nextTop > 0) {
          window.scrollTo(0, nextTop)
          this.back()
        } else {
          document.body.scrollTop = 0
        }
      }, 0)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-backToTop
  position fixed
  z-index 9999
  bottom 10%
  right 10%
  wh(40px,40px)
  border 1px solid Silver
  border-radius 50%
  font-size 1.8em
  text-align center
  color Silver
  cursor pointer
  animation showB2T .4s
  &:hover
    border-color Green
    color Green
    transition all .3s

@keyframes showB2T
  0%
    border 0
    opacity 0
  50%
    transform rotateZ(180deg)
  100%
    opacity 1
    transform rotateZ(180deg)
</style>
