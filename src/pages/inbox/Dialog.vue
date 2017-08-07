<template lang="html">
  <div class="df-inboxDialog">
    <intro :intro="intro"></intro>
    <div class="main-wrapper">
      <div class="main">
        <el-form class="c-form reply-form" ref="form" :model="form" :rules="rules">
          <div class="reply">
            <el-form-item class="item" prop="body">
              <el-input
                v-model="form.body"
                placeholder="旅行者，此地可汇集神能，反馈与汝灵能相配之人。"
                resize="none"
                type="textarea"
                :autosize="{ minRows:2, maxRows:4 }"
              ></el-input>
            </el-form-item>
            <el-button class="btn-pub publish" @click="submitForm" :loading="isLoading">回复</el-button>
          </div>
        </el-form>
        <template v-if="inboxDialog.length>0">
          <div class="inbox-item" v-for="(message,key) in inboxDialog" :key="key">
            <router-link :to="message.user.profileUrl">
              <img class="avatar" :src="message.user.avatar" alt="avatar">
            </router-link>
            <div class="item-content">
              <router-link class="tdu" :to="message.user.profileUrl">{{ message.user.name }}</router-link>
              <p>{{ message.body }}</p>
              <div class="info">
                <span class="created-at">{{ message.created_at }}</span>
                <div class="item-button-group">
                  <el-button class="btn-can" :data-id="message.id" @click="deleteMessage">
                    <i class="fa fa-trash-o" :data-id="message.id"></i>
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
      },
      form: {
        body: ''
      },
      rules: {
        body: [
          {
            required: true,
            message: '私信内容不能为空。',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '私信内容至少为6个字符。',
            trigger: 'blur'
          }
        ]
      },
      isLoading: false
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
    // 删除对话内容
    deleteMessage(e) {
      this.$confirm('旅行者，是否要删除该条私信内容？', '魔法蓄力ING', {
        confirmButtonText: 'YES',
        cancelButtonText: 'NO',
        type: 'warning',
        customClass: 'c-confirm',
        confirmButtonClass: 'btn-pub',
        cancelButtonClass: 'btn-can'
      }).then(() => {
        this.deleteInboxMessage(Number(e.target.dataset.id))
      })
    },
    async submitForm() {
      this.isLoading = true
      await this.$refs['form'].validate(valid => {
        if (valid) {
          this.storeDialogMessage(this.form)
        }
      })
      this.isLoading = false
      // 清空私信表单
      this.form = {}
    },
    ...mapActions([
      'loadInboxDialog',
      'storeDialogMessage',
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
        fj(center)
        .reply
          fj(center)
          width 75%
          .item
            width 100%
          .publish
            height 54px
            margin-left 20px
      .inbox-item
        margin 20px 0
        padding 10px
        border-bottom 1px solid Extra-Light-Grey
        font-size .8em
        color Silver
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
