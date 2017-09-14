<template lang="html">
  <div class="df-work">
    <intro :intro="intro"></intro>
    <div class="main-wrapper" v-if="works.author">
      <div class="main" v-if="works.author.works_count > 0">
        <div class="info">
          <router-link
            class="tdu"
            :to="{ path: works.author.profileUrl }"
            >{{ works.author.nickname }}</router-link>
          共有<span class="sum">{{ works.author.works_count }}</span>部作品
        </div>
        <div class="item">
          <h2 class="title">诗文</h2>
          <sub-poem :poem="poem" v-for="(poem, index) in works.poem" :key="index"></sub-poem>
        </div>
        <div class="item">
          <h2 class="title">品鉴</h2>
          <sub-apprec :apprec="apprec" v-for="(apprec, index) in works.appreciation" :key="index"></sub-apprec>
        </div>
      </div>
      <blank-area hint="暂无作品" v-else></blank-area>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import { mapMutations } from 'vuex'
import Intro from '@/components/intro'
import BlankArea from '@/components/blankArea'
import SubPoem from '@/components/subPoem'
import SubApprec from '@/components/subApprec'
export default {
  name: 'userWork',
  components: {
    SubPoem,
    SubApprec,
    Intro,
    BlankArea
  },
  data() {
    return {
      intro: {
        title: '作品列表',
        content: '旅行者，作品列表记录了你在诗词小筑的一点一滴。从激活密纹之力，收藏诗文，到关注别人与被他人关注，它似回马灯般闪烁于你我之心。诗词小筑，休憩之所，愿能与君共飨片刻温存。',
        icon: 'fa fa-book'
      },
      works: {}
    }
  },
  created() {
    this.getWorks()
  },
  methods: {
    getWorks() {
      this.TOGGLE_LOADING_STATUS()
      api.get(this.$router.currentRoute.path).then(response => {
        this.TOGGLE_LOADING_STATUS()
        this.works = response.data
      }).catch(error => {
        this.TOGGLE_LOADING_STATUS()
        this.$message({
          message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~',
          type: 'error',
          customClass: 'c-msg',
          duration: 0,
          showClose: true
        })
        Promise.reject(error)
      })
    },
    ...mapMutations([
      'TOGGLE_LOADING_STATUS'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-work
  .main-wrapper
    fj(center)
    margin-bottom 20px
    .main
      width 60%
      .info
        padding 10px 0
        border-bottom 1px solid Extra-Light-Grey
        .sum
          color Red
          margin 0 5px
      .item
        padding 20px 0
        .title
          text-align center
          color Silver
</style>
