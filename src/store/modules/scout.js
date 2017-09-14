import * as types from '../mutation-types'
import api from '@/api'
import { Message } from 'element-ui'
import router from '../../router'
const state = {
  scoutPoems: [],
  scoutApprecs: []
}
const getters = {
  scoutPoems: state => state.scoutPoems,
  scoutApprecs: state => state.scoutApprecs
}
const actions = {
  // 加载检索的内容列表
  scoutContentList({commit}) {
    commit(types.TOGGLE_LOADING_STATUS)
    api.get(router.currentRoute.fullPath).then(response => {
      commit(types.TOGGLE_LOADING_STATUS)
      commit(types.SCOUT_CONTENTLIST, response.data)
    }).catch(error => {
      commit(types.TOGGLE_LOADING_STATUS)
      Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
      Promise.reject(error)
    })
  }
}
const mutations = {
  [types.SCOUT_CONTENTLIST](state, scoutContent) {
    state.scoutPoems = scoutContent['poem']
    state.scoutApprecs = scoutContent['appreciation']
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
