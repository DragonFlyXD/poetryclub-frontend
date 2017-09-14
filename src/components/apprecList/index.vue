<template lang="html">
  <div class="df-apprecList">
    <header class="header">心随意动，叩开梦门</header>
    <div class="apprecs">
      <div class="apprec"
        v-for="(apprec, index) in localApprecs"
        :key="index"
        @click="appreciation(apprec.appreciationUrl)"
      >
        <div class="left">
          <strong class="title">{{ apprec.title }}</strong>
          <div class="content" v-html="apprec.body"></div>
        </div>
        <div class="right">
          <img :src="apprec.user.avatar" alt="avatar" class="avatar">
          <div class="name">{{ apprec.authorName }}</div>
        </div>
      </div>
    </div>
    <footer class="footer" v-if="isMoreApprecs">
      <el-button class="more" type="text" @click="toggleApprecDialog">查看更多</el-button>
    </footer>
    <el-dialog
      custom-class="c-reply apprecs-dialog"
      title="全部品鉴"
      :visible.sync="apprecsDialogVisible"
      >
      <header class="header">
        全部品鉴：<span class="total-apprecs">{{ this.apprecs.length }}</span>
      </header>
      <div class="body">
        <div class="apprec"
          v-for="(apprec, index) in this.apprecs"
          :key="index"
          @click="appreciation(apprec.appreciationUrl)"
        >
          <div class="left">
            <strong class="title">{{ apprec.title }}</strong>
            <div class="content">{{ apprec.body }}</div>
          </div>
          <div class="right">
            <img :src="apprec.user.avatar" alt="avatar" class="avatar">
            <div class="name">{{ apprec.authorName }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'apprecList',
  props: {
    apprecs: {
      type: Array,
      default: []
    }
  },
  computed: {
    localApprecs() {
      if (this.apprecs.length > 5) {
        this.isMoreApprecs = true
        return this.apprecs.slice(0, 5)
      }
      return this.apprecs
    }
  },
  data() {
    return {
      isMoreApprecs: false,
      apprecsDialogVisible: false
    }
  },
  methods: {
    appreciation(path) {
      this.$router.push(path)
    },
    toggleApprecDialog() {
      this.apprecsDialogVisible = !this.apprecsDialogVisible
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-apprecList
  margin-bottom 30px
  .header
    margin 10px 0
    font(1em, Light-Silver)
    font-weight bold
  .footer
    fj(center)
    .more
      font(.8em, Green)
      &:hover
        color Red
.apprec
  fj(space-between)
  margin 10px 0
  padding 10px
  border 1px solid Extra-Light-Grey
  border-radius 3px
  &:hover
    background-color Dark-White
    cursor pointer
  .left
    overflow hidden
    .title
      font(1.2em, Silver)
    .content
      height 125px
      margin 5px 0
      font(.8em, Silver)
      p
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
  .right
    padding-left 10px
    .avatar
      wh(40px, 40px)
      border-radius 3px
      box-shadow 0 1px 1px rgba(0,0,0,.2)
    .name
      display block
      font(.8em, Green)
.apprecs-dialog
  .header
    .total-apprecs
      color Red
</style>
