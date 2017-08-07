<template lang="html">
  <div class="df-inbox">
    <intro :intro="intro"></intro>
    <div class="main-wrapper">
      <div class="main">
        <div class="button-group">
          <el-button class="btn-default" @click="toggleReplyDialog">
            <i class="fa fa-send"></i> 发送私信
          </el-button>
          <el-button class="btn-default" @click="markAsRead">
            <i class="fa fa-check"></i> 全部标记为已读
          </el-button>
        </div>
        <el-tabs type="card" class="content">
          <el-tab-pane>
            <span slot="label" class="title">
              <i class="fa fa-comments"></i>未读信息
            </span>
            <template v-if="unreadMessages.length>0">
              <div class="inbox-item" v-for="(message,key) in unreadMessages" :key="key">
                <router-link :to="message.user.profileUrl">
                  <img class="avatar" :src="message.user.avatar" alt="avatar">
                </router-link>
                <div class="item-content">
                  <router-link class="tdu" :to="message.user.profileUrl">{{ message.user.nickname }}</router-link>
                  <p>{{ message.body }}</p>
                  <div class="info">
                    <span class="created-at">{{ message.publish_time }}</span>
                    <div class="item-button-group">
                      <el-button class="btn-pub" @click="dialog(message.dialogUrl)">查看对话</el-button>
                      <el-button class="btn-can" :data-did="message.dialog_id" @click="deleteDialog">
                        <i class="fa fa-trash-o" :data-did="message.dialog_id"></i>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <blank-area
              hint="暂无私信"
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
                  <img class="avatar" :src="message.user.avatar" alt="avatar">
                </router-link>
                <div class="item-content">
                  <router-link class="tdu" :to="message.user.profileUrl">{{ message.user.nickname }}</router-link>
                  <p>{{ message.body }}</p>
                  <div class="info">
                    <span class="created-at">{{ message.publish_time }}</span>
                    <div class="item-button-group">
                      <el-button class="btn-pub" @click="dialog(message.dialogUrl)">查看对话</el-button>
                      <el-button class="btn-can" :data-did="message.dialog_id" @click="deleteDialog">
                        <i class="fa fa-trash-o" :data-did="message.dialog_id"></i>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <blank-area
              hint='暂无私信'
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
      <reply @isCancel="toggleReplyDialog"></reply>
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
import Reply from '@/components/reply'
export default {
  name: 'inbox',
  components: {
    Intro,
    BlankArea,
    Reply
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
    // 删除对话
    deleteDialog(e) {
      this.$confirm('旅行者，是否要删除该对话内容', '魔王降临ING', {
        confirmButtonText: 'YES',
        cancelButtonText: 'NO',
        type: 'warning',
        customClass: 'c-confirm',
        confirmButtonClass: 'btn-pub',
        cancelButtonClass: 'btn-can'
      }).then(() => {
        this.deleteInboxDialog(Number(e.target.dataset.did))
      })
    },
    // 跳转到指定对话列表
    dialog(dialogUrl) {
      this.$router.push(dialogUrl)
    },
    toggleReplyDialog() {
      this.dialogVisible = !this.dialogVisible
    },
    ...mapActions([
      'loadInboxMessages',
      'deleteInboxDialog',
      'markAsRead'
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
