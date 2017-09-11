<template lang="html">
  <div class="df-apprec">
    <div class="main">
      <sub-apprec
        v-for="(apprec, index) in apprecs"
        :apprec="apprec"
        :key="index"
      ></sub-apprec>
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
  </div>
</template>

<script>
import SubApprec from '@/components/subApprec'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'appreciation',
  components: {
    SubApprec
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
      'apprecs',
      'apprecCurrentPage',
      'apprecLastPage'
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
    // 加载品鉴列表
    await this.loadApprecList()
    // 给 window 绑定 scroll 事件，实现无限加载
    window.addEventListener('scroll', this.next, false)
  },
  methods: {
    resetPagination() {
      this.storeApprecCurrentPage(0)
      this.storeApprecLastPage(0)
    },
    // 下拉加载品鉴列表
    async next() {
      // 当滚动到底部时 且 小于最后一页 且 没有正在加载中
      if (document.body.scrollTop + window.innerHeight >= document.body.scrollHeight &&
        this.apprecCurrentPage < this.apprecLastPage && !this.isLoading) {
        // 给加载按钮腾出50px空间
        document.querySelector('.df-apprec').style.marginBottom = '50px'
        // 显示加载按钮 并 显示正在加载的 spinner
        this.spinnerVisible = this.isLoading = true
        // 获取品鉴分页数据，去掉全局 Loading 事件
        await this.loadApprecList(true)
        // 隐藏加载按钮 与 停止 spinner
        this.spinnerVisible = this.isLoading = false
        // 归还腾出的空间
        document.querySelector('.df-apprec').style.marginBottom = '0'
      } else if (this.apprecCurrentPage === this.apprecLastPage && !this.isLastPage) {
        // 若分页达最后一页，则抛出提醒信息
        this.$message({
          message: '旅行者，你已至诗词小筑的终焉。:)',
          type: 'warning',
          customClass: 'c-msg'
        })
        // 腾出50px的空间，显示提醒信息
        document.querySelector('.df-apprec').style.marginBottom = '50px'
        this.isLastPage = true
      }
    },
    ...mapActions([
      'loadApprecList',
      'storeApprecCurrentPage',
      'storeApprecLastPage'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-apprec
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
