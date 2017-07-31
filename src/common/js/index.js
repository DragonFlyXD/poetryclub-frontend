import store from '@/store'
import router from '@/router'

export default {
  // 未登录操作重定向至登录页面
  notLogged() {
    if (!store.state.isLogined) {
      router.push({
        path: '/user/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
      return false
    }
    return true
  },
  // 已登录重定向至首页
  logged() {
    if (store.state.isLogined) {
      router.replace({
        path: '/'
      })
    }
  }
}
