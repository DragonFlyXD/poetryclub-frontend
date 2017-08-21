<template lang="html">
  <div class="df-password">
    <el-alert
      class="alert"
      title="旅行者，密码重置邮件成功。请前往注册邮箱查收，些许邮箱在垃圾邮件才能找到，:)"
      type="success"
      v-show="alertVisible"
    ></el-alert>
    <div class="main">
      <h1 class="title">旅行者，寻回你的密纹</h1>
      <el-form class="form c-form" ref="form" :rules="rules" :model="form">
        <el-form-item label="邮箱" prop="email">
          <el-input
            placeholder="请输入你的注册邮箱"
            v-model="form.email"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="publish btn-pub"
            :disabled="isLoaded"
            :loading="isLoading"
            @click="submitForm"
          >发送邮件</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import c from '@/common/js'
export default {
  name: 'passwordForget',
  data() {
    return {
      alertVisible: false,
      isLoading: false,
      isLoaded: false,
      form: {
        email: ''
      },
      rules: {
        email: [{
          required: true,
          message: '邮箱不能为空。',
          trigger: 'blur'
        }, {
          max: 50,
          message: '邮箱不能大于50个字符。',
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
          message: '格式不正确。',
          trigger: 'blur'
        }, {
          validator: this.validateEmail,
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    c.logged()
  },
  methods: {
    // 验证注册邮箱是否存在
    validateEmail(r, v, cb) {
      api.post('user/password/forget', this.form).then(response => {
        if (response.data) {
          if (response.data.email) {
            cb(new Error('注册邮箱不存在。'))
          }
        }
        cb()
      })
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.is_submit = true
          this.isLoading = true
          api.post('user/password/forget', this.form).then(response => {
            this.isLoading = false
            if (response.data.forget) {
              this.isLoaded = true
              this.alertVisible = true
            }
          }).catch(error => {
            this.isLoading = false
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
@import '../../../common/stylus/common'

.df-password
  .alert
    margin-top 10px
    text-align center
  .main
    z-index 999
    position absolute
    top 50%
    left 50%
    transform translate(-50%,-50%)
    width 25%
    .title
      text-align center
      color Green
    .form
      .publish
        width 100%
</style>
