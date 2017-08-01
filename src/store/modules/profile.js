import * as types from '../mutation-types'
import api from '@/api'
import {Message} from 'element-ui'
const state = {
  // 个人信息
  profile: {
    name: '', // 用户名
    id: '', // ID
    nickname: '', // 昵称
    gender: '', // 性别
    birthday: '', // 生日
    signature: '',  // 个性签名
    location: '', // 居住地
    occupation: '', // 职业
    bio: '',  // 个人简历
    poet: '', // 最喜欢的诗人
    avatar: '' // 头像地址
  }
}
// 个人信息匹配项
let matches = [
  'nickname',
  'gender',
  'birthday',
  'signature',
  'location',
  'occupation',
  'bio',
  'poet'
]
const getters = {
  profile: state => state.profile
}
const actions = {
  // 加载用户或者个人信息
  async loadProfile({commit}) {
    commit(types.TOGGLE_LOADING_STATUS)
    await api.get('user').then(response => {
      commit(types.TOGGLE_LOADING_STATUS)
      // 加载用户信息
      commit(types.LOAD_PROFILE, response.data)
    }).catch(error => {
      commit(types.TOGGLE_LOADING_STATUS)
      Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
      Promise.reject(error)
    })
  },
  // 更新个人信息
  updateProfile({state, commit}) {
    commit(types.TOGGLE_LOADING_STATUS)
    // 待更新项
    let profile = {}
    matches.map(item => {
      // 格式化性别
      if (item === 'gender') {
        if (state.profile[item]) {
          profile[item] = state.profile[item] === '男'
            ? 1
            : 2
        } else {
          profile[item] = 0
        }
      } else {
        profile[item] = state.profile[item]
      }
    })
    api.put('user/update', profile).then(response => {
      commit(types.TOGGLE_LOADING_STATUS)
      // 更新个人信息成功
      if (response.data.updated) {
        Message({message: '更新成功。', type: 'success', customClass: 'c-msg'})
      } else {
        Message({message: '更新失败。', type: 'error', customClass: 'c-msg'})
      }
    }).catch(error => {
      commit(types.TOGGLE_LOADING_STATUS)
      Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
      Promise.reject(error)
    })
  },
  // 更新个人头像
  updateAvatar({commit}, avatar) {
    commit(types.UPDATE_AVATAR, avatar)
  }
}
const mutations = {
  [types.LOAD_PROFILE](state, profile) {
    state.profile = profile
  },
  [types.UPDATE_AVATAR](state, avatar) {
    state.profile.avatar = avatar
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
