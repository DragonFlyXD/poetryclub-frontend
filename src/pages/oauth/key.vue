<template lang="html">
</template>

<script>
import c from '@/common/js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'authKey',
  computed: {
    ...mapGetters([
      'isLogined'
    ])
  },
  created() {
    if (this.isLogined) {
      // 登录过的用户，跳转到首页
      c.logged()
    } else {
      // 获取 access_token
      const token = this.$router.currentRoute.query.token
      this.successLogin(token)
    }
  },
  methods: {
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
      'TOGGLE_LOADING_STATUS',
      'CHECKOUT_LOGIN_STATUS'
    ]),
    ...mapActions([
      'loadProfile'
    ])
  }
}
</script>
