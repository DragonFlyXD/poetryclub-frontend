import * as types from '../mutation-types'
import api from '@/api'
import {Message} from 'element-ui'
import router from '../../router'
const state = {
  allMessages: {},
  unreadMessages: {},
  inboxDialog: [],
  unreadLength: 0
}
const getters = {
  allMessages: state => state.allMessages,
  unreadMessages: state => state.unreadMessages,
  inboxDialog: state => state.inboxDialog,
  unreadLength: state => state.unreadLength
}
const actions = {
  // 加载私信列表
  async loadInboxMessages({commit}, quit = false) {
    commit(types.TOGGLE_LOADING_STATUS, quit)
    await api.get('inbox').then(response => {
      commit(types.TOGGLE_LOADING_STATUS, quit)
      // 获取私信列表并计算未读私信的数量
      let unreadArr = Object.keys(response.data.unreadMessages)
      let unreadLength = unreadArr ? unreadArr.length : 0
      response.data['unreadLength'] = unreadLength
      commit(types.LOAD_INBOX_MESSAGES, response.data)
    })
  },
  // 加载对话列表
  loadInboxDialog({commit}) {
    commit(types.TOGGLE_LOADING_STATUS)
    api.get('inbox/' + router.currentRoute.path.match(/(\d+)$/)[0]).then(response => {
      commit(types.TOGGLE_LOADING_STATUS)
      // 获取对话列表数据
      commit(types.LOAD_INBOX_DIALOG, response.data)
    }).catch(error => {
      commit(types.TOGGLE_LOADING_STATUS)
      Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
      Promise.reject(error)
    })
  },
  // 删除私信内容
  deleteInboxMessage({commit}, id) {
    commit(types.DELETE_INBOX_MESSAGE, id)
    api.delete('inbox/' + router.currentRoute.path.match(/(\d+)$/)[0] + '/dialog/' + id).then(response => {
      if (response.data.deleted === true) {
        // 更新对话内容
        commit(types.DELETE_INBOX_MESSAGE, id)
        Message({message: '删除私信成功。', type: 'success', customClass: 'c-msg'})
      }
    })
  },
  // 删除对话
  deleteInboxDialog({commit}, dialogId) {
    commit(types.DELETE_INBOX_DIALOG, dialogId)
    api.delete('inbox/' + dialogId).then(response => {
      if (response.data.deleted === true) {
        commit(types.DELETE_INBOX_DIALOG, dialogId)
        Message({message: '删除私信成功。', type: 'success', customClass: 'c-msg'})
      }
    }).catch(error => {
      Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
      Promise.reject(error)
    })
  }
}
const mutations = {
  [types.LOAD_INBOX_MESSAGES](state, {allMessages, unreadMessages, unreadLength}) {
    state.allMessages = allMessages
    state.unreadMessages = unreadMessages
    state.unreadLength = unreadLength
  },
  [types.LOAD_INBOX_DIALOG](state, dialog) {
    state.inboxDialog = dialog
  },
  [types.DELETE_INBOX_DIALOG](state, dialogId) {
    // 剔除 unreadMessages 里已删除的私信
    state.unreadMessages.map((item, key) => {
      if (item.dialog_id === dialogId) {
        state.unreadMessages.splice(key, 1)
      }
    })
    // 剔除 allMessags 里已删除的私信
    state.allMessages.map((item, key) => {
      if (item.dialog_id === dialogId) {
        state.allMessages.splice(key, 1)
      }
    })
  },
  [types.DELETE_INBOX_MESSAGE](state, id) {
    state.inboxDialog.map((item, key) => {
      // 剔除已删除的私信内容
      if (item.id === id) {
        state.inboxDialog.splice(key, 1)
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
