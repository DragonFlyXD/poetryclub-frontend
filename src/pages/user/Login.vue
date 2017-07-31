<template lang="html">
  <div class="df-login">
    <div class="main-wrapper">
      <el-form class="main c-form" :rules="rules" :model="form" ref="form">
        <el-form-item prop="name" label="神念">
          <el-input
            v-model="form.name"
            placeholder="用户名/已验证邮箱"
          ><i class="fa fa-user" slot="prepend"></i></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密纹">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="密码"
          ><i class="fa fa-lock" slot="prepend"></i></el-input>
        </el-form-item>
        <el-form-item prop="isRemember">
          <div class="remember">
            <el-checkbox
              v-model="form.isRemember"
            >自动登录</el-checkbox>
            <el-button type="text">忘记密码❤️</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="publish" @click="submitForm">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="text-line-35">第三方登录</div>
      <div class="oauth-box">
        <el-button><i class="fa fa-qq"></i></el-button>
        <el-button><i class="fa fa-weixin"></i></el-button>
        <el-button><i class="fa fa-weibo"></i></el-button>
        <el-button><i class="fa fa-github"></i></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import c from '@/common/js'
import { mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  name: 'userLogin',
  data() {
    return {
      form: {
        name: '',
        password: '',
        isRemember: false
      },
      rules: {
        name: [
          {
            required: true,
            message: '旅行者，报上名来，;-)',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '远方来的朋友么，这个宝箱需要密钥，(⊙o⊙)',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'isLogined'
    ])
  },
  created() {
    c.logged()
  },
  methods: {
    // 验证表单
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) { // 验证成功后，提交表单
          this.TOGGLE_LOADING_STATUS()
          let data = {
            'password': this.form.password,
            'isRemember': this.form.isRemember
          }
          // 判断用户是用 name 或 email 登录的
          if (/^[\u4E00-\u9FFFa-zA-Z0-9_-]{4,20}$/.test(this.form.name)) {
            data.name = this.form.name
            data.email = ''
          } else {
            data.email = this.form.name
            data.name = ''
          }
          api.post('user/login', data).then(response => {
            this.TOGGLE_LOADING_STATUS()
            if (response.data.error) {
              return this.$message({
                message: response.data.error.message,
                type: 'error',
                customClass: 'c-msg',
                showClose: true
              })
            }
            // 登录成功
            this.$message({
              message: '【' + response.data.name + '】，登录成功，\\(^o^)/~。',
              type: 'success',
              customClass: 'c-msg'
            })
            // 存储 ACCESS_TOKEN 进 localstorage
            window.localStorage.setItem('ACCESS_TOKEN', response.data.access_token)
            // 更改登录状态
            this.CHECKOUT_LOGIN_STATUS()
            // 加载个人信息
            this.loadProfile()
            // 跳转到首页
            this.$router.replace('/')
          }).catch(error => {
            this.TOGGLE_LOADING_STATUS()
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
    ...mapMutations([
      'TOGGLE_LOADING_STATUS',
      'CHECKOUT_LOGIN_STATUS'
    ]),
    ...mapActions([
      'loadProfile'
    ])
  }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-login
  fj(center,center)
  height 100%
  .main-wrapper
    width 33.3%
    .main
      .remember
        fj(space-between)
      .publish
        width 100%
    .oauth-box
      fj(center)
      margin 20px 0
      &>button
        font-size 1.3em
        border-radius 50%
        bdco(Green,Green)
        transition all .2s ease
        &:hover,&:focus
          border-radius 5px
          bc(Green,White)
</style>
