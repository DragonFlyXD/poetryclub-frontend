<template lang="html">
  <div class="df-poemView">
    <div class="main">
      <page-view
        :page="poem"
        :status="poemStatus"
      ></page-view>
      <apprec-list
        v-if="poem.appreciations_count > 0"
        :apprecs="poem.appreciations"
      ></apprec-list>
      <comment
        :comments="poemStatus.comments"
        :modelId="poem.id"
      ></comment>
    </div>
    <div class="side">
      <div class="text-line-40">INFO</div>
      <page-info
        :page="poem"
        :status="poemStatus"
      ></page-info>
      <div class="text-line-35">AUTHOR</div>
      <author-info v-if="poem.user"
        :page="poem"
        :status="poemStatus"
      ></author-info>
    </div>
  </div>
</template>

<script>
import PageView from '@/components/pageView'
import ApprecList from '@/components/apprecList'
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
    ApprecList,
    Comment,
    PageInfo,
    AuthorInfo
  },
  computed: {
    ...mapGetters([
      'poem',
      'poemStatus'
    ])
  },
  created() {
    // 加载诗文数据
    this.loadPoem(this.$router.currentRoute.path)
  },
  watch: {
    '$route' (to, from) {
      this.loadPoem(this.$router.currentRoute.path)
    }
  },
  methods: {
    ...mapActions([
      'loadPoem'
    ])
  }

}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-poemView
  fj(center)
  margin-top 20px
  .main
    width 50%
    margin-right 50px
  .side
    width 20%
</style>
