<template lang="html">
  <div class="df-inbox">
    <intro :intro="intro"></intro>
    <div class="main-wrapper">
      <div class="main">
        <div class="button-group">
          <el-button class="btn-default" @click="toggleReplyDialog">发送私信</el-button>
          <el-button class="btn-default" @click="markAsRead">全部标记为已读</el-button>
        </div>
        <el-tabs type="card" class="content">
          <el-tab-pane>
            <span slot="label" class="title">
              <i class="fa fa-comments"></i>未读信息
            </span>
            <template v-if="unreadMessages.length>0">
              <div class="inbox-item" v-for="(message,key) in unreadMessages" :key="key">
                <router-link :to="message.user.profileUrl">
                  <img class="avatar" src="#" alt="avatar">
                </router-link>
                <div class="item-content">
                  <router-link class="tdu" :to="message.user.profileUrl">{{ message.user.name }}</router-link>
                  <p>{{ message.body }}</p>
                  <div class="info">
                    <span class="created-at">{{ message.created_at }}</span>
                    <div class="item-button-group">
                      <el-button class="btn-pub" @click="goDialog(message.dialogUrl)">查看对话</el-button>
                      <el-button class="btn-can" :data-did="message.dialog_id" @click="_deleteInboxDialog">
                        <i class="fa fa-trash-o" :data-did="message.dialog_id"></i>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <blank-area
              hint="私信空空"
              v-else
            ></blank-area>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label" class="title">
              <i class="fa fa-bell"></i>全部消息通知与私信
            </span>
            <template v-if="allMessages.length>0">
              <div class="inbox-item" v-for="message in allMessages">
                <router-link :to="message.user.profileUrl">
                  <img class="avatar" src="#" alt="avatar">
                </router-link>
                <div class="item-content">
                  <router-link class="tdu" :to="message.user.profileUrl">{{ message.user.name }}</router-link>
                  <p>{{ message.body }}</p>
                  <div class="info">
                    <span class="created-at">{{ message.created_at }}</span>
                    <div class="item-button-group">
                      <el-button class="btn-pub" @click="goDialog(message.dialogUrl)">查看对话</el-button>
                      <el-button class="btn-can" :data-did="message.dialog_id" @click="_deleteInboxDialog">
                        <i class="fa fa-trash-o" :data-did="message.dialog_id"></i>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <blank-area
              hint='私信空空'
              v-else
            ></blank-area>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog
      custom-class="c-reply"
      title="发送私信"
      size="tiny"
      v-model="dialogVisible"
      >
      <header class="header">
        <span>接收人：</span>
        <span class="receiver">赵四</span>
      </header>
      <el-input
        class="c-form"
        type="textarea"
        resize="none"
        :autosize="{ minRows: 4, maxRows: 6}"
      ></el-input>
      <footer slot="footer">
        <el-button class="btn-default" type="text" @click="toggleReplyDialog">取消</el-button>
        <el-button class="btn-default">确定</el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
import Intro from '@/components/intro'
import BlankArea from '@/components/blankArea'
export default {
  name: 'inbox',
  components: {
    Intro,
    BlankArea
  },
  data() {
    return {
      intro: {
        title: '消息通知与私信',
        content: '旅行者，消息通知与私信记录了你在诗词小筑的一点一滴。从激活密纹之力，收藏诗文，到关注别人与被他人关注，它似回马灯般闪烁于你我之心。诗词小筑，休憩之所，愿能与君共飨片刻温存。',
        icon: 'fa fa-bell'
      },
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'allMessages',
      'unreadMessages',
      'unreadLength'
    ])
  },
  created() {
    this.loadInboxMessages()
  },
  methods: {
    // 跳转到指定对话列表
    goDialog(dialogUrl) {
      this.$router.push(dialogUrl)
    },
    // 全部标志已读
    markAsRead() {
      console.log(this.unreadMessages)
    },
    toggleReplyDialog() {
      this.dialogVisible = !this.dialogVisible
    },
    _deleteInboxDialog(e) {
      this.deleteInboxDialog(Number(e.target.dataset.did))
    },
    ...mapActions([
      'loadInboxMessages',
      'deleteInboxDialog'
    ])
  }
}
</script>
<style lang="stylus" scpoed>
@import '../../common/stylus/common'

.df-inbox
  color Silver
  .main-wrapper
    fj(center)
    .main
      position relative
      width 75%
      .button-group
        position absolute
        top 0
        right 0
        z-index 999
      .content
        .is-active .title
          color Green
        .el-tabs__item
          color Silver
          &:hover
            color Green
          i
            margin-right 5px
        .inbox-item
          margin 20px 0
          padding 10px
          border-bottom 1px solid Extra-Light-Grey
          font-size .8em
          &:hover
            border-radius 5px
            border-bottom-color Dark-White
            box-shadow 0 1px 1px rgba(0,0,0,.2)
            background-color Dark-White
          .avatar
            float left
            margin-right 15px
            wh(50px,50px)
            border-radius 5px
            box-shadow 0 1px 1px rgba(0,0,0,.2)
          .item-content
            line-height 2em
            overflow hidden
            .info
              position relative
              margin 5px 0
              .created-at
                font-size .7em
                color Light-Silver
              .item-button-group
                position absolute
                top -15px
                right 1px
</style>
