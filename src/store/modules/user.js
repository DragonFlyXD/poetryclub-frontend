import * as types from '../mutation-types'
import api from '@/api'
import {Message} from 'element-ui'

const state = {
  users: []
}
const getters = {
  users: state => state.users
}
const actions = {
  async fetchUser({commit}, queryStr) {
    await api.get(`user/search?query=${queryStr}`).then(response => {
      commit(types.FETCH_USER, response.data)
    }).catch(error => {
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
const mutations = {
  [types.FETCH_USER] (state, users) {
    state.users = users
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
