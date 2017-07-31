import * as types from './mutation-types'
import {Loading} from 'element-ui'

export default {
  // 检验登录状态
  [types.CHECKOUT_LOGIN_STATUS](state) {
    state.isLogined = !!window.localStorage.ACCESS_TOKEN
  },
  // Loading 动画
  [types.TOGGLE_LOADING_STATUS](state, quit = false) {
    // 若不进行 加载动画
    if (!quit) {
      state.isLoading = !state.isLoading
      if (state.isLoading) {
        // Loading 为单例
        state.loadingInstance = Loading.service({
          text: '正在前往诗词小筑...',
          customClass: 'c-loading'
        })
      }
      // 如果加载已结束，则关闭它
      if (!state.isLoading) {
        if (state.loadingInstance) {
          state.loadingInstance.close()
        }
      }
    }
  },
  // 用户退出
  [types.USER_LOGOUT](state) {
    // 清除用户的 ACCESS_TOKEN
    window.localStorage.removeItem('ACCESS_TOKEN')
  }
}
