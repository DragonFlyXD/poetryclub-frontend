<template lang="html">
  <div class="df-verify">
    <div class="main">
      <h1 class="title">重置你的密纹</h1>
      <el-form class="form c-form" ref="form" :rules="rules" :model="form">
        <el-form-item label="新密码" prop="password">
          <el-input
            placeholder="新密码至少6位"
            type="password"
            v-model="form.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirmation">
          <el-input
            placeholder="请再次输入新密码"
            type="password"
            v-model="form.password_confirmation"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="btn-pub publish"
            :loading="isLoading"
            :disabled="isLoaded"
            @click="submitForm"
          >重置密码</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import api from '@/api'
import c from '@/common/js'
export default {
  name: 'passwordVerify',
  data() {
    return {
      isLoaded: false,
      isLoading: false,
      form: {
        password: '',
        password_confirmation: ''
      },
      rules: {
        password: [{
          required: true,
          message: '新密码不能为空。',
          trigger: 'blur'
        }, {
          min: 6,
          max: 20,
          message: '新密码必须介于6-20个字符之间。',
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^[a-zA-Z0-9_-]{6,20}$/,
          message: '格式不正确。',
          trigger: 'blur'
        }],
        password_confirmation: [{
          validator: this.validatePassword,
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    c.logged()
  },
  methods: {
    // 验证密码
    validatePassword(rule, value, cb) {
      if (value === '') {
        cb(new Error('请再次输入新密码。'))
      } else if (value !== this.form.password) {
        cb(new Error('两次输入密码不一致。'))
      } else {
        cb()
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.isLoading = true
          const path = this.$router.currentRoute.path
          api.post(path, this.form).then(response => {
            this.isLoading = false
            if (response.data.verified) {
              this.isLoaded = true
              // 用户登录
              this.successLogin(response.data.access_token)
              this.$message({
                message: '旅行者，密码重置成功。',
                type: 'success',
                customClass: 'c-msg'
              })
            } else {
              this.$message({
                message: '旅行者，confirmation_token失效或不存在，请重新发送密码重置邮件。',
                type: 'error',
                customClass: 'c-msg',
                duration: 0,
                showClose: true
              })
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
    },
    // 成功登录后的操作
    successLogin(token) {
      // 存储 ACCESS_TOKEN 进 localstorage
      window.localStorage.setItem('ACCESS_TOKEN', token)
      // 更改登录状态
      this.CHECKOUT_LOGIN_STATUS()
      // 加载个人信息
      this.loadProfile()
      // 跳转到首页
      this.$router.replace('/')
    },
    ...mapMutations([
      'CHECKOUT_LOGIN_STATUS'
    ]),
    ...mapActions([
      'loadProfile'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../common/stylus/common'

.df-verify
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
