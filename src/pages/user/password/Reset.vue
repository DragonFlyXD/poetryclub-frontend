<template lang="html">
  <div class="df-reset">
    <div class="main">
      <el-form class="form c-form" ref="form" :rules="rules" :model="form">
        <el-form-item label="原密码" prop="old_password">
          <el-input
            v-model="form.old_password"
            type="password"
            placeholder="请输入您的原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="新密码至少6位"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirmation">
          <el-input
            v-model="form.password_confirmation"
            type="password"
            placeholder="请再次输入您的新密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
          class="publish"
          :loading="isLoading"
          :disabled="isReset"
          @click="submitForm">更新密码</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '@/api'
export default {
  name: 'passwordReset',
  data() {
    return {
      isLoading: false,
      isReset: false,
      form: {
        old_password: '',
        password: '',
        password_confirmation: ''
      },
      rules: {
        old_password: [
          {
            required: true,
            message: '原密码不能为空。',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '新密码不能为空。',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '新密码必须介于6-20个字符之间。',
            trigger: 'blur'
          },
          {
            type: 'string',
            pattern: /^[a-zA-Z0-9_-]{6,20}$/,
            message: '格式不正确。',
            trigger: 'blur'
          }
        ],
        password_confirmation: [
          {
            validator: this.validatePassword,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.isLoading = true
          api.post('/user/password/reset', this.form).then(response => {
            this.isLoading = false
            if (response.data.reset) {
              this.isReset = true
              this.$message({
                message: '密码修改成功。',
                type: 'success',
                customClass: 'c-msg'
              })
            } else {
              this.$message({
                message: '原密码错误。',
                type: 'error',
                customClass: 'c-msg'
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
    validatePassword(rule, value, cb) {
      if (value === '') {
        cb(new Error('请再次输入密码。'))
      } else if (value !== this.form.password) {
        cb(new Error('两次输入密码不一致。'))
      } else {
        cb()
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '../../../common/stylus/common'

.df-reset
  fj(center)
  margin-top 50px
  .main
    width 33%
    .publish
      width 100%
      margin-top 30px
</style>
