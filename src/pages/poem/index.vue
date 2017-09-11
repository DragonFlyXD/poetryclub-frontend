<template lang="html">
  <div class="df-poem">
    <div class="main">
      <sub-poem
        v-for="(poem, index) in poems"
        :key="index"
        :poem="poem"
        >
      </sub-poem>
      <el-button
        class="spinner btn-default"
        v-show="spinnerVisible"
        :loading="isLoading"
      >Loading...</el-button>
      <span
        class="last-page"
        v-if="isLastPage"
      >旅行者，你已至诗词小筑的终焉。:)</span>
    </div>
  </div>
</template>

<script>
import SubPoem from '@/components/subPoem'
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'poem',
  components: {
    SubPoem
  },
  data() {
    return {
      spinnerVisible: false,  // 是否显示加载按钮
      isLoading: false,         // 加载按钮是否正在加载
      isLastPage: false // 是否为最后一页
    }
  },
  computed: {
    ...mapGetters([
      'poems',
      'poemLastPage',
      'poemCurrentPage'
    ])
  },
  // 当离开页面时,去除页面 scroll 事件
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('scroll', this.next, false)
    next()
  },
  async created() {
    // 重置分页参数
    this.resetPagination()
    // 加载诗文列表
    await this.loadPoemList()
    // 给 window 绑定 scroll 事件，实现无限加载
    window.addEventListener('scroll', this.next, false)
  },
  methods: {
    resetPagination() {
      this.storePoemCurrentPage(0)
      this.storePoemLastPage(0)
    },
    // 下拉加载诗文列表
    async next() {
      // 当滚动到底部时 且 小于最后一页 且 没有正在加载中
      if (document.body.scrollTop + window.innerHeight >= document.body.scrollHeight &&
        this.poemCurrentPage < this.poemLastPage && !this.isLoading) {
        // 给加载按钮腾出50px空间
        document.querySelector('.df-poem').style.marginBottom = '50px'
        // 显示加载按钮 并 显示正在加载的 spinner
        this.spinnerVisible = this.isLoading = true
        // 获取诗文分页数据，去掉全局 Loading 事件
        await this.loadPoemList(true)
        // 隐藏加载按钮 与 停止 spinner
        this.spinnerVisible = this.isLoading = false
        // 归还腾出的空间
        document.querySelector('.df-poem').style.marginBottom = '0'
      } else if (this.poemCurrentPage === this.poemLastPage && !this.isLastPage) {
        // 若分页达最后一页，则抛出提醒信息
        this.$message({
          message: '旅行者，你已至诗词小筑的终焉。:)',
          type: 'warning',
          customClass: 'c-msg'
        })
        // 腾出50px的空间，显示提醒信息
        document.querySelector('.df-poem').style.marginBottom = '50px'
        this.isLastPage = true
      }
    },
    ...mapActions([
      'loadPoemList',
      'storePoemCurrentPage',
      'storePoemLastPage'
    ])
  }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-poem
  fj(center,center)
  margin-top 20px
  .main
    width 50%
    position relative
    .spinner
      position absolute
      width 100%
    .last-page
      color Red
</style>
