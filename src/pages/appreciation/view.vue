<template lang="html">
  <div class="df-apprecView">
    <div class="main">
      <page-view
        model="appreciation"
        :page="apprec"
        :status="apprecStatus"
      ></page-view>
      <comment
        model="appreciation"
        :comments="apprecStatus.comments"
        :modelId="apprec.id"
      ></comment>
    </div>
    <div class="side">
      <div class="text-line-40">INFO</div>
      <page-info
        :page="apprec"
        :status="apprecStatus"
      ></page-info>
      <div class="text-line-35">AUTHOR</div>
      <author-info v-if="apprec.user"
        :page="apprec"
        :status="apprecStatus"
      ></author-info>
    </div>
  </div>
</template>

<script>
import PageView from '@/components/pageView'
import Comment from '@/components/comment'
import PageInfo from '@/components/pageInfo'
import AuthorInfo from '@/components/authorInfo'
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'poemView',
  components: {
    PageView,
    Comment,
    PageInfo,
    AuthorInfo
  },
  computed: {
    ...mapGetters([
      'apprec',
      'apprecStatus'
    ])
  },
  created() {
    // 加载品鉴数据
    this.loadApprec(this.$router.currentRoute.path)
  },
  watch: {
    '$route' (to, from) {
      this.loadApprec(this.$router.currentRoute.path)
    }
  },
  methods: {
    ...mapActions([
      'loadApprec'
    ])
  }

}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-apprecView
  fj(center)
  margin-top 20px
  .main
    width 50%
    margin-right 50px
  .side
    width 20%
</style>
