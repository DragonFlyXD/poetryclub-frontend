<template lang="html">
  <div class="df-inboxDialog">
    <intro :intro="intro"></intro>
    <div class="main-wrapper">
      <div class="main">
        <div class="reply-form c-form">
          <el-input
            class="input"
            placeholder="旅行者，此地可汇集神能，反馈与汝灵能相配之人。"
            resize="none"
            type="textarea"
            :autosize="{ minRows:2, maxRows:4 }"
          ></el-input>
          <el-button>回复</el-button>
        </div>
        <template v-if="inboxDialog.length>0">
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
          hint="私信已空"
          v-else
        ></blank-area>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
import BlankArea from '@/components/blankArea'
import Intro from '@/components/intro'
export default {
  name: 'inboxDialog',
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
      }
    }
  },
  computed: {
    ...mapGetters([
      'inboxDialog'
    ])
  },
  created() {
    this.loadInboxDialog()
  },
  methods: {
    _deleteInboxMessage(e) {
      this.deleteInboxMessage(Number(e.target.dataset.id))
    },
    ...mapActions([
      'loadInboxDialog',
      'deleteInboxMessage'
    ])
  }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-inboxDialog
  .main-wrapper
    fj(center)
    .main
      width 75%
      .reply-form
        fj(space-around)
        .input
          width 75%
</style>
