import * as types from '../mutation-types'
import api from '@/api'
import {Message} from 'element-ui'
import router from '../../router'
const state = {
  allMessages: [],
  unreadMessages: [],
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
      Message({
        message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~',
        type: 'error',
        customClass: 'c-msg',
        duration: 0,
        showClose: true
      })
      Promise.reject(error)
    })
  },
  // 储存私信内容
  storeInboxMessage({commit}, message) {
    api.post('inbox', message).then(response => {
      if (response.data.sent) {
        commit(types.STORE_INBOX_MESSAGE, response.data.message)
        Message({
          message: '私信发送成功。',
          type: 'success',
          customClass: 'c-msg'
        })
      } else {
        Message({
          message: '私信发送失败。',
          type: 'success',
          customClass: 'c-msg',
          duration: 0,
          showClose: true
        })
      }
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
  },
  // 存储对话内容
  async storeDialogMessage({commit}, message) {
    const dialogId = router.currentRoute.params.id
    api.post(`inbox/${dialogId}`, message).then(response => {
      if (response.data.sent) {
        commit(types.STORE_DIALOG_MESSAGE, response.data.message)
        Message({
          message: '私信发送成功。',
          type: 'success',
          customClass: 'c-msg'
        })
      } else {
        Message({
          message: '私信发送失败。',
          type: 'success',
          customClass: 'c-msg',
          duration: 0,
          showClose: true
        })
      }
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
  },
  // 删除对话内容
  deleteInboxMessage({commit}, id) {
    const dialogId = router.currentRoute.params.id
    api.delete(`inbox/${dialogId}/dialog/${id}`).then(response => {
      if (response.data.deleted) {
        commit(types.DELETE_INBOX_MESSAGE, id)
        Message({
          message: '删除私信成功。',
          type: 'success',
          customClass: 'c-msg'
        })
      }
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
  },
  // 删除对话
  deleteInboxDialog({commit}, dialogId) {
    api.delete(`inbox/${dialogId}`).then(response => {
      if (response.data.deleted) {
        commit(types.DELETE_INBOX_DIALOG, dialogId)
        Message({
          message: '删除对话成功。',
          type: 'success',
          customClass: 'c-msg'
        })
      }
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
  },
  // 全部未读私信标志已读
  markAsRead({commit}) {
    api.get('inbox/view').then(response => {
      if (response.data.read) {
        commit(types.MARK_READ_INBOX)
        Message({
          message: '全部未读私信标志已读。',
          type: 'success',
          customClass: 'c-msg'
        })
      }
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
  [types.LOAD_INBOX_MESSAGES](state, {allMessages, unreadMessages, unreadLength}) {
    state.allMessages = allMessages
    state.unreadMessages = unreadMessages
    state.unreadLength = unreadLength
  },
  [types.LOAD_INBOX_DIALOG](state, dialog) {
    state.inboxDialog = dialog
  },
  // 存储私信内容
  [types.STORE_INBOX_MESSAGE](state, message) {
    state.allMessages.map((item, index) => {
      // 若私信双方有交流过，则将旧的列表预览剔除掉
      if (item['dialog_id'] === message['dialog_id']) {
        state.allMessages.splice(index, 1)
      }
    })
    state.allMessages.unshift(message)
  },
  [types.STORE_DIALOG_MESSAGE](state, message) {
    state.inboxDialog.unshift(message)
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
  },
  [types.MARK_READ_INBOX](state) {
    state.unreadMessages = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
