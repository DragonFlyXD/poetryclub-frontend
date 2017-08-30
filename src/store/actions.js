import * as types from './mutation-types'
import api from '@/api'
import {Message} from 'element-ui'

export default {
  // 退出登录
  logout({commit}) {
    commit(types.TOGGLE_LOADING_STATUS)
    api.post('user/logout').then(response => {
      commit(types.TOGGLE_LOADING_STATUS)
      // 如果用户退出成功
      if (response.data.logout) {
        // 清除 localstorage 中的 ACCESS_TOKEN
        commit(types.USER_LOGOUT)
        // 检测登录状态
        commit(types.CHECKOUT_LOGIN_STATUS)
        Message({message: '退成成功。', type: 'success', customClass: 'c-msg'})
      }
    }).catch(error => {
      commit(types.TOGGLE_LOADING_STATUS)
      Message({
        message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~',
        type: 'error',
        customClass: 'c-msg',
        duration: 0,
        showClose: true
      })
      Promise.reject(error)
    })
  }
}
