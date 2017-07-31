<template lang="html">
  <el-menu class="df-header" default-active="1" mode="horizontal" :router="true">
    <el-row justify="space-around" type="flex">
      <el-col class="nav" :span="8">
        <el-menu-item index="1" :route="{ name:'home' }">首页</el-menu-item>
        <el-menu-item index="2" :route="{ name:'poem' }">诗库</el-menu-item>
        <el-menu-item index="4" :route="{ name:'discuss' }">梦门</el-menu-item>
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
        <el-button class="create" @click="createPoem">创作</el-button>
      </el-col>
      <el-col class="actions" :span="3" >
        <template v-if="isLogined">
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
            <el-menu-item index="8-3" :route="{ name:'userFavorites' }">
              <i class="fa fa-file"></i>收藏列表
            </el-menu-item>
            <el-menu-item index="8-4" :route="{ name:'userHistory' }">
              <i class="fa fa-paw"></i>私人动态
            </el-menu-item>
            <el-menu-item index="8-5" :route="{ name: 'userReset'}">
              <i class="fa fa-paper-plane"></i>修改密码
            </el-menu-item>
            <el-menu-item index="8-6" :route="{ path:'/' }" @click.native="logout">
              <i class="fa fa-sign-out"></i>退出登录
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="9" class="inbox" :route="{name:'inbox'}">
            <el-badge :max="99" :value="unreadLength">
              <i class="fa fa-bell"></i>
            </el-badge>
          </el-menu-item>
        </template>
        <template v-else>
          <el-menu-item index="6" :route="{ name:'userLogin' }">登录</el-menu-item>
          <el-menu-item index="7" :route="{ name:'userRegister' }">注册</el-menu-item>
        </template>
      </el-col>
    </el-row>
  </el-menu>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  name: 'header',
  computed: {
    ...mapGetters([
      'isLogined',
      'unreadLength',
      'profile'
    ])
  },
  data() {
    return {
      // 是否已经加载过用户信息
      isLoaded: false
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
    // 跳转到创作页面
    createPoem() {
      this.$router.push('/poem/create')
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
    .menu
      z-index 999
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
      padding 0
      border none
      color Silver
      &:hover
        color Green
        transform none
        transition all .2s
      .el-badge
        &>sup
          top 20px
          background-color Green
        &>i
          font-size 1.5em
    .is-active
      .el-submenu__title
        border-bottom-left-radius 70%
        border-bottom-right-radius 70%
        border-bottom 3px solid Green
        color Green
        transition all .2s
      i
        color Green
</style>
