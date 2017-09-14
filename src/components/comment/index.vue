<template lang="html">
  <div class="df-comment">
    <header class="header">
      <strong class="title">集密纹之力于右手，发表评论吧</strong>
      <el-badge :value="comments.length"></el-badge>
    </header>
    <div class="main-wrapper">
      <img class="avatar" :src="profile.avatar" alt="avatar" v-if="isLogined">
      <img class="avatar" src="http://images.dragonflyxd.com/default.png" alt="avatar" v-else>
      <div class="main">
        <template v-if="isLogined">
          <el-input
            class="c-form"
            placeholder="Thunder in Everyone of Us."
            ref="input"
            type="textarea"
            v-model="body"
            :rows="inputRows"
            @focus="focusInput"
            @click.native="stopShakeInput"
          ></el-input>
          <div class="button-group">
            <el-button class="btn-can" @click="blurInput">收回密纹之力</el-button>
            <el-button class="btn-pub" @click="storeComment">释放密纹神能</el-button>
          </div>
        </template>
        <template v-else>
          <el-input
            class="c-form"
            placeholder="旅行者，请前往村祭坛【登录】后方可汇聚密纹之力。"
            type="textarea"
            :disabled="true">
          </el-input>
          <div class="not-logged">
              <el-button class="btn-default" @click="login">登录</el-button>
              <span class="or">OR</span>
              <el-button class="btn-default" @click="register">注册</el-button>
          </div>
        </template>
      </div>
    </div>
    <div class="comments">
      <template v-if="comments.length>0">
        <div
          class="comment"
          v-for="(item,index) in comments"
          :key="index"
          >
          <router-link :to="{ path: item.profileUrl }">
            <img class="avatar" :src="item.avatar" alt="avatar">
          </router-link>
          <div class="main">
            <div class="info">
              <div class="name">
                <router-link class="tdu" :to="{ path: item.profileUrl }">{{ item.nickname }}</router-link>
              </div>
              <span>{{ item.publish_time }}</span>
            </div>
            <div class="body">{{ item.body }}
              <div class="reply-body" v-if="item.parent !== null">
                <router-link class="tdu" :to="{ path: item.parent.profileUrl }">{{ item.parent.nickname }}:</router-link>
                <span>{{ item.parent.body }}</span>
              </div>
              <div class="c-form form" :ref="item.id">
                <el-input
                  type="textarea"
                ></el-input>
                <div class="button-group">
                  <el-button
                    :data-comment-id="item.id"
                    @click="toggleReplyIpt"
                  >取消</el-button>
                  <el-button
                    :data-user-id="item.user_id"
                    :data-comment-id="item.id"
                    @click="storeReplyComment"
                  >确定</el-button>
                </div>
              </div>
              <el-button
                class="reply"
                type="text"
                :data-comment-id="item.id"
                @click="toggleReplyIpt"
                v-if="item.user_id !== profile.id && isLogined"
              ><i class="fa fa-reply"></i>回复</el-button>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <blank-area></blank-area>
      </template>
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import BlankArea from '@/components/blankArea'
export default {
  name: 'comment',
  props: {
    comments: {
      type: Array,
      default: []
    },
    modelId: {
      type: Number,
      default: 0
    },
    model: {
      type: String,
      default: 'poem'
    }
  },
  components: {
    BlankArea
  },
  data() {
    return {
      inputRows: 2,
      body: ''
    }
  },
  computed: {
    ...mapGetters([
      'isLogined',
      'profile'
    ])
  },
  methods: {
    // 存储评论
    async storeComment() {
      // 如果文本框无内容，则提醒用户输入
      // 并展示 shakeTextarea 的动画效果
      if (!this.body || this.body === '旅行者,请务必写点什么...') {
        this.startShakeInput()
      } else {
        const comment = {
          'model': this.modelId,
          'type': this.model,
          'body': this.body
        }
        if (this.model === 'poem') {
          await this.storePoemComment(comment)
        } else if (this.model === 'appreciation') {
          await this.storeApprecComment(comment)
        }
        this.body = ''
      }
    },
    // 储存回复评论
    async storeReplyComment(e) {
      const textarea = this.$refs[e.currentTarget.dataset.commentId][0].querySelector('textarea')
      const body = textarea.value
      if (body === '') {
        return this.$message({
          message: '回复内容不能为空。',
          type: 'warning',
          customClass: 'c-msg'
        })
      }
      const comment = {
        'model': this.modelId,
        'type': this.model,
        'body': body,
        'parent': e.currentTarget.dataset.commentId
      }
      if (this.model === 'poem') {
        await this.storePoemComment(comment)
      } else if (this.model === 'appreciation') {
        await this.storeApprecComment(comment)
      }
      this.$refs[e.currentTarget.dataset.commentId][0].style.display = 'none'
      textarea.value = ''
    },
    toggleReplyIpt(e) {
      // 获取评论ID
      const commentId = e.currentTarget.dataset.commentId
      const comment = this.$refs[commentId][0]
      // 切换表单与回复按钮
      if (comment.style.display === 'block') {
        this.$refs[commentId][0].style.display = 'none'
        comment.nextSibling.nextSibling.style.display = 'block'
      } else {
        this.$refs[commentId][0].style.display = 'block'
        comment.nextSibling.nextSibling.style.display = 'none'
      }
    },
    startShakeInput() {
      this.$refs['input'].$el.style.animation = 'skTxta .8s cubic-bezier(.3,-.15,.5,-.15) infinite running'
      this.body = '旅行者,请务必写点什么...'
    },
    stopShakeInput() {
      let commentInput = this.$refs['input'].$el
      // 判断动画是否正在进行
      if (commentInput.style.animationPlayState === 'running') {
        commentInput.style.animationPlayState = 'paused'
        this.body = ''
      }
    },
    focusInput(e) {
      if (!/(\s|^)+show-btn{1}(\s|$)+/.test(e.target.parentNode.className)) {
        e.target.parentNode.className += ' show-btn'
        this.iptRows = 3
        this.stopShakeInput()
      }
    },
    blurInput() {
      this.$refs['input'].$el.className = this.$refs['input'].$el.className.replace(/(\s|^)+show-btn{1}(\s|$)+/, '')
      this.iptRows = 2
      this.stopShakeInput()
    },
    login() {
      this.$router.push({
        name: 'userLogin'
      })
    },
    register() {
      this.$router.push({
        name: 'userRegister'
      })
    },
    ...mapActions([
      'storePoemComment',
      'storeApprecComment'
    ])
  }
}
</script>
<style lang="stylus">
@import '../../common/stylus/common'

.df-comment
  .header
    .title
      display inline-block
      font(1em,Light-Silver)
    sup
      padding 3px 7px
      border-radius 50%
      background-color Green !important
  .main-wrapper
    fj()
    margin-top 10px
    .avatar
      margin-right 10px
      wh(54px,54px)
      border-radius 50%
      box-shadow 0 1px 1px rgba(0,0,0,.2)
      cursor pointer
    .main
      width 100%
      .show-btn
        &+div
          display block !important
          button
            animation showBtn 1s
      .button-group
        display none
        margin 10px 0
      .not-logged
        fj(flex-end)
        margin-top 10px
        font-size .8em
        color Silver
        .or
          margin 0 20px
          font-size 2em
  .comments
    margin 30px 0
    .comment
      fj()
      margin-top 20px
      font(.7em,Light-Silver)
      .avatar
        wh(45px,45px)
        border-radius 50%
        box-shadow 0 1px 1px rgba(0,0,0,.2)
        cursor pointer
      .main
        width 100%
        margin-left 15px
        .reply-title
          padding 2px
          border 1px solid Extra-Light-Silver
          border-radius 3px
          font-size .7em
          color Silver
        .info
          fj(space-between)
        .body
          overflow hidden
          margin-top 5px
          font-size 1.2em
          line-height 2em
          .reply-body
            position relative
            margin-top 5px
            padding 10px
            border 1px solid Extra-Light-Grey
            border-radius 3px
            background-color Dark-White
          .form
            display none
            margin-top 10px
            .button-group
              margin-top 10px
          .reply
            display block
            margin-top 5px
            font(.7em,Light-Silver)
            letter-spacing 1px
            transition all .2s
            &:hover,&:focus
              color Green
            i
              margin-right 3px
</style>
