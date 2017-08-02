<template lang="html">
  <div class="df-home">
    <div class="main">
      <div class="billboard">
        <h3><i class="fa fa-fire"></i>HOT POEMS</h3>
      </div>
      <sub-poem
      :poem="poem"
      :key="index"
      v-for="(poem,index) in localData.poem"
      v-if="localData.poem"
      ></sub-poem>
    </div>
    <div class="side"></div>
  </div>
</template>

<script>
import api from '@/api'
import SubPoem from '@/components/subPoem'
import { mapMutations } from 'vuex'
export default {
  name: 'home',
  components: {
    SubPoem
  },
  data() {
    return {
      localData: {}
    }
  },
  created() {
    !this.isLoaded && this.getLocalData()
  },
  methods: {
    getLocalData() {
      this.TOGGLE_LOADING_STATUS()
      this.isLoaded = true
      api.get('home').then(response => {
        this.TOGGLE_LOADING_STATUS()
        this.localData = response.data
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

.df-home
  fj(center)
  margin-top 20px
  .main
    width 50%
    margin-right 50px
    .billboard
      border-bottom 1px solid Extra-Light-Grey
      color Silver
      i
        margin-right 20px
        color Red
  .side
    width 20%
</style>
