<template lang="html">
  <section class="df-feedback">
    <div class="main-wrapper">
      <div class="main">
        <div class="declaration">
          初次建站，难免有大量BUG与须完善的功能。<br/>
          如有疏漏不妥之处，还请不吝赐教。<br />
          拜谢。
          <a class="tdu" href="https://segmentfault.com/a/1190000010428981" target="_blank">
            网站已开源 :)
          </a>
        </div>
        <el-form class="form c-form" ref="form" :model="form" :rules="rules">
          <div class="info">
            <a class="tdu" href="http://chenlongfei.me" target="_blank">
              <i class="fa fa-home"></i>个人博客
            </a>
            <a class="tdu" href="https://github.com/DragonFlyXD" target="_blank">
              <i class="fa fa-github"></i>GitHub
            </a>
            <a class="tdu" href="http://music.163.com/#/user/home?id=323933339" target="_blank">
              <i class="fa fa-music"></i>网易云音乐
            </a>
            <el-tooltip content="dragonfly920130@outlook.com" effect="light">
              <a class="tdu" href="#"><i class="fa fa-envelope-o"></i>个人邮箱</a>
            </el-tooltip>
            <el-tooltip>
              <div slot="content">
                <img class="wechat" src="http://images.dragonflyxd.com/wechat.jpg" alt="wechat">
              </div>
              <a class="tdu" href="#"><i class="fa fa-wechat"></i>微信</a>
            </el-tooltip>
          </div>
          <div class="tip">你可以通过填写下面这个表单，来向我提交意见。</div>
          <el-form-item prop="subject">
            <el-input
              placeholder="请填写邮件主题"
              v-model="form.subject"
            ></el-input>
          </el-form-item>
          <el-form-item prop="body">
            <quill-editor
              class="c-quill"
              :options="editorOptions"
              v-model="form.body"
            ></quill-editor>
          </el-form-item>
          <el-form-item>
            <el-button
              class="send"
              :loading="isSending"
              :disabled="isSent"
              @click="feedbackShipped">
              <i class="fa fa-paper-plane-o"></i>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
import {quillEditor} from 'vue-quill-editor'
import api from '@/api'
export default {
  name: 'feedback',
  components: {
    quillEditor
  },
  data() {
    return {
      editorOptions: { // quill 编辑器配置
        theme: 'bubble',
        placeholder: '邮件内容，支持Markdown语法。'
      },
      form: { // 邮件主题与内容
        subject: '',
        body: ''
      },
      rules: { // 表单验证规则
        subject: [
          {
            required: true,
            message: '主题不能为空。',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 120,
            message: '主题必须介于4-120个字符之间。',
            trigger: 'blur'
          }
        ],
        body: [{
          required: true,
          message: '内容不能为空。',
          trigger: 'blur'
        }]
      },
      // 邮件是否正在发送
      isSending: false,
      // 邮件是否已发送
      isSent: false
    }
  },
  methods: {
    // 发送反馈邮件
    feedbackShipped() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.isSending = true
          api.post('email/feedback', this.form).then(response => {
            this.isSending = false
            this.isSent = true
            this.$notify({
              title: '密语',
              message: '旅行者，你的旨意我们已收到。感谢你的支持，拜谢!',
              type: 'success',
              customClass: 'c-msg'
            })
          }).catch(error => {
            this.isSending = false
            this.isSent = true
            this.$message({
              message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~',
              type: 'error',
              customClass: 'c-msg',
              duration: 0,
              showClose: true
            })
            Promise.reject(error)
          })
        }
        return false
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-feedback
  margin-top 20px
  .main-wrapper
    fj(center)
    .main
      width 50%
      .declaration
        padding 10px
        border 1px solid Light-Silver
        border-radius 5px
        box-shadow 0px 1px 1px rgba(0,0,0,.2)
        text-align center
        line-height 2em
        color Silver
      .form
        .info
          fj(center)
          margin 20px 0
          padding 10px 0
          border 1px solid Light-Silver
          border-radius 10px
          a
            margin-right 20px
            &>i
              margin-right 5px
        .tip
          margin 20px 0
          padding 10px 0
          text-align center
          border-radius 10px
          bc(Dark-White,Silver)
        .send
          wh(100%,50px)
          border-radius 50px
          font-size 1.5em
          text-align center
.wechat
  wh(200px,200px)
</style>
