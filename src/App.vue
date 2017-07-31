<template lang="html">
  <div id="app">
    <div id="main">
      <app-header></app-header>
      <transition name="router-fade">
        <router-view></router-view>
      </transition>
      <back-to-top></back-to-top>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppHeader from '@/components/header'
import AppFooter from '@/components/footer'
import BackToTop from '@/components/backToTop'
export default {
  name: 'app',
  components: {
    AppHeader,
    AppFooter,
    BackToTop
  }
}
</script>

<style lang="stylus">
@import "./common/stylus/common"

body,html
  margin 0
  padding 0
  height 100%
  font-family 'monaco', 'menlo', serif, sans-serif
  font-size 16px
  #app
    position relative
    min-height 100%
    #main
      padding-bottom 90px
      /* 页面过渡动画 */
      .router-fade-enter-active, .router-fade-leave-active
        transition opacity .3s
      .router-fade-enter, .router-fade-leave-active
        opacity 0
</style>
