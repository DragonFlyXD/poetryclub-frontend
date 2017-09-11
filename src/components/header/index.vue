<template lang="html">
  <el-menu class="df-header" default-active="1" mode="horizontal" :router="true">
    <el-row justify="space-around" type="flex">
      <el-col class="nav" :span="8">
        <el-menu-item index="1" :route="{ name:'home' }">首页</el-menu-item>
        <el-menu-item index="2" :route="{ name:'poem' }">诗库</el-menu-item>
        <el-menu-item index="4" :route="{ name:'apprec' }">梦门</el-menu-item>
        <el-menu-item index="5" :route="{ name:'feedback' }">反馈</el-menu-item>
      </el-col>
      <el-col class="searchbar-wrapper" :span="7">
        <el-input
          class="searchbar c-form"
          ref="searchbar"
          icon="search"
          placeholder="搜索你感兴趣的诗文..."
          :on-icon-click="scout"
          @keyup.enter.native="scout"
          @blur="blurSearchBar"
          @focus="focusSearchBar"
        ></el-input>
        <el-button class="create" @click="toggleCreateDialog">创作</el-button>
      </el-col>
      <el-col class="actions" :span="3" >
        <template v-if="isLogined">
          <el-popover
            popper-class="inbox-popover"
            ref="inbox-popover"
            trigger="click"
          >
            <span class="title">全部私信</span>
            <template v-if="allMessages.length > 0">
              <div
                class="content"
                v-for="(message,index) in allMessages"
                >
                <div class="item" @click="dialog(message.dialogUrl)">
                  <img :src="message.user.avatar" alt="avatar" class="avatar">
                  <div class="main">
                    <span class="name">{{ message.user.nickname }}</span>
                    <span class="body">{{ message.body }}</span>
                  </div>
                </div>
              </div>
            </template>
            <blank-area hint="暂无私信" v-else></blank-area>
            <footer class="footer">
              <el-button class="btn-default send" type="text" @click="toggleInboxDialog">
                <i class="fa fa-envelope-o"></i>
              </el-button>
              <el-button class="btn-default" type="text" @click="viewInbox">查看全部私信</el-button>
              <el-dialog
                custom-class="c-reply"
                title="发送私信"
                size="tiny"
                v-model="inboxDialogVisible"
                :modal-append-to-body="false"
                >
                <reply @isCancel="toggleInboxDialog"></reply>
              </el-dialog>
            </footer>
          </el-popover>
          <el-button type="text" class="inbox btn-can" v-popover:inbox-popover>
            <el-badge :max="99" :value="unreadLength">
              <i class="fa fa-bell"></i>
            </el-badge>
          </el-button>
          <el-submenu class="menu" index="8">
            <template slot="title">
              <img :src="profile.avatar" alt="avatar" class="avatar">
            </template>
            <el-menu-item index="8-1" :route="{ name:'userProfile' }">
              <i class="fa fa-user"></i>个人资料
            </el-menu-item>
            <el-menu-item index="8-2">
              <i class="fa fa-cog"></i>账户设置
            </el-menu-item>
            <el-menu-item index="8-5" :route="{ name: 'passwordReset'}">
              <i class="fa fa-paper-plane"></i>修改密码
            </el-menu-item>
            <el-menu-item index="8-6" :route="{ path:'/' }" @click.native="logout">
              <i class="fa fa-sign-out"></i>退出登录
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item index="6" :route="{ name:'userLogin' }">登录</el-menu-item>
          <el-menu-item index="7" :route="{ name:'userRegister' }">注册</el-menu-item>
        </template>
      </el-col>
    </el-row>
    <el-dialog
      class="create-dialog c-dialog"
      title="创作吧, 骚年~"
      size="tiny"
      :visible.sync="createDialogVisible"
    >
      <div class="main">
        <el-button class="btn-pub" @click="createPoem">诗文</el-button>
        <el-button class="btn-pub" @click="createApprec">品鉴</el-button>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import BlankArea from '@/components/blankArea'
import Reply from '@/components/reply'
export default {
  name: 'header',
  components: {
    BlankArea,
    Reply
  },
  computed: {
    ...mapGetters([
      'isLogined',
      'unreadLength',
      'allMessages',
      'profile'
    ])
  },
  data() {
    return {
      // 是否已经加载过用户信息
      isLoaded: false,
      createDialogVisible: false,
      inboxDialogVisible: false
    }
  },
  async created() {
    // 加载未读私信
    if (this.isLogined && !this.isLoaded) {
      // 加载个人信息
      await this.$router.currentRoute.path !== '/user/profile' && this.loadProfile()
      // 加载私信内容
      await this.$router.currentRoute.path !== '/inbox' && this.loadInboxMessages(true)
      this.isLoaded = true
    }
  },
  methods: {
    // 检索用户输入的关键字
    scout() {
      this.$router.push('/scout?query=' + this.$refs['searchbar'].$data.currentValue + '&s=' + Math.random())
    },
    // 跳转到诗文创作页面
    createPoem() {
      this.$router.push('/poem/create')
      this.createDialogVisible = false
    },
    // 跳转到品鉴创作页面
    createApprec() {
      this.$router.push('/appreciation/create')
      this.createDialogVisible = false
    },
    // 跳转到私信页面
    viewInbox() {
      this.$router.push('/inbox')
    },
    // 跳转到指定的对话列表
    dialog(dialogUrl) {
      this.$router.push(dialogUrl)
    },
    toggleCreateDialog() {
      this.createDialogVisible = !this.createDialogVisible
    },
    toggleInboxDialog() {
      this.inboxDialogVisible = !this.inboxDialogVisible
    },
    focusSearchBar(e) {
      e.target.parentNode.className += ' searchbar-act'
    },
    blurSearchBar(e) {
      e.target.parentNode.className = e.target.parentNode.className.replace(/(\s|^)+searchbar-act{1}(\s|$)+/, '')
    },
    ...mapActions([
      'logout',
      'loadInboxMessages',
      'loadProfile'
    ])
  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/common'

.df-header
  font-weight bold
  background-color White !important
  .el-menu-item
    font-size 1em
    transition all .2s ease
    &:hover
      border-bottom 3px solid Green
      bc(White !important,Green)
      transform translateY(-10px)
    &.is-active
      border-bottom-left-radius 80%
      border-bottom-right-radius 10%
      border-bottom 3px solid Green
      color Green
  .searchbar-wrapper
    padding-top 15px
    .searchbar-act
      width 100% !important
      transition all .5s
      &+button
        position absolute
        zoom .001
        transform scale(0)
        transition all .5s
    .searchbar
      width 70%
      &>i
        &:focus,&:hover
          color Green !important
    .create
      margin-left 10px
      color Silver
      text-align center
      &:hover, &:focus
        bdco(Green,Green)
  .actions
    fj()
    .menu
      border 0
      .el-submenu__title
        &:hover
          background-color White
        .avatar
          wh(40px,40px)
          margin-top 10px
          border-radius 40px
        &>i
          display none
      .el-menu-item
        border 0
        font(.8em,Light-Silver)
        text-align center
        &>i
          padding-right 5px
          color Light-Green
          &:hover
            color Green
        &:hover
          border-bottom 0
          transform translateY(-3px)
    .inbox
      z-index 999
      .el-badge
        &>sup
          top 20px
          background-color Green
        &>i
          font-size 1.8em
    .is-active
      .el-submenu__title
        border-bottom-left-radius 70%
        border-bottom-right-radius 70%
        border-bottom 3px solid Green
        color Green
        transition all .2s
      i
        color Green
.inbox-popover
  width 25%
  .title
    display block
    padding 5px 0 10px 0
    border-bottom 1px solid Extra-Light-Grey
    font-size 1.2em
    text-align center
    color Silver
  .content
    padding 10px 0 5px 0
    .item
      fj()
      box-sizing border-box
      height 68px
      padding 10px
      &:hover
        border-radius 5px
        background-color Dark-White
        cursor pointer
      .avatar
        wh(40px, 40px)
        border-radius 3px
        box-shadow 0 1px 1px rgba(0,0,0,.2)
      .main
        overflow hidden
        margin-left 20px
        line-height 2em
        span
          display block
        .name
          font-size 1.2em
          color Green
        .body
          overflow hidden
          font(.8em, Silver)
          text-overflow ellipsis
          white-space nowrap
  .footer
    fj(space-between)
    margin-top 10px
    padding 0 10px
    border-top 1px solid Extra-Light-Grey
    .send
      font-size 2em
.create-dialog
  .el-dialog__title
    color Silver
  .main
    fj()
    flex-direction column
    button
      width 100%
      margin 10px 0
</style>
