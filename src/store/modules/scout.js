import * as types from '../mutation-types'
import api from '@/api'
import { Message } from 'element-ui'
import router from '../../router'
const state = {
  scoutPoems: []
}
const getters = {
  scoutPoems: state => state.scoutPoems
}
const actions = {
  // 加载检索的诗文列表
  scoutPoemList({commit}) {
    commit(types.TOGGLE_LOADING_STATUS)
    api.get(router.currentRoute.fullPath).then(response => {
      commit(types.TOGGLE_LOADING_STATUS)
      commit(types.SCOUT_POEMLIST, response.data.poem)
    }).catch(error => {
      commit(types.TOGGLE_LOADING_STATUS)
      Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
      Promise.reject(error)
    })
  }
}
const mutations = {
  [types.SCOUT_POEMLIST](state, scoutPoems) {
    state.scoutPoems = scoutPoems
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
