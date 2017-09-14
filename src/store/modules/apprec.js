import * as types from '../mutation-types'
import s from '../state'
import api from '@/api'
import axios from 'axios'
import {Message} from 'element-ui'
import router from '../../router'
import c from '@/common/js'

const state = {
  apprecs: [], // 品鉴列表
  apprec: {}, // 指定品鉴
  apprecCurrentPage: 0, // 品鉴列表当前页数
  apprecLastPage: 0, // 品鉴列表最后一页
  apprecStatus: {
    voted: false, // 是否赞过品鉴
    favored: false, // 是否收藏过品鉴
    rated: 0, // 是否评分过品鉴
    followed: false, // 是否关注品鉴作者
    comments: [], // 品鉴评论
    rating: 0  // 品鉴评分
  }
}

const getters = {
  apprecs: state => state.apprecs,
  apprec: state => state.apprec,
  apprecStatus: state => state.apprecStatus,
  apprecLastPage: state => state.apprecLastPage,
  apprecCurrentPage: state => state.apprecCurrentPage
}
const actions = {
  // 加载品鉴列表
  async loadApprecList({commit, state}, quit = false) {
    commit(types.TOGGLE_LOADING_STATUS, quit)
    await api.get(`appreciation?page=${state.apprecCurrentPage + 1}`).then(response => {
      commit(types.TOGGLE_LOADING_STATUS, quit)
      // 获取品鉴列表数据
      commit(types.LOAD_APPRECLIST, response.data.data)
      // 获取分页最后一页
      !state.apprecCurrentPage && commit(types.STORE_APPREC_LASTPAGE, response.data.last_page)
      // 获取当前页数
      commit(types.STORE_APPREC_CURRENTPAGE, response.data.current_page)
    }).catch(error => {
      commit(types.TOGGLE_LOADING_STATUS, quit)
      Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
      Promise.reject(error)
    })
  },
  // 加载指定品鉴信息
  async loadApprec({commit, dispatch, state}, path) {
    commit(types.TOGGLE_LOADING_STATUS)
    // 获取品鉴ID
    const apprec = path.match(/(\d+)$/)[0]
    // 获取用户对该品鉴的点赞、收藏、评分状态与品鉴的平均评分
    s.isLogined && await dispatch('getApprecStatus', apprec)
    // 获取品鉴主要信息
    await api.get(path).then(response => {
      commit(types.TOGGLE_LOADING_STATUS)
      // 如果未找到指定品鉴，则重定向至404页面
      if (response.data.error) {
        response.data.error.http_code === 404 && router.push({name: '404'})
      }
      // 加载品鉴数据与作者数据
      commit(types.LOAD_APPREC, response.data)
      // 加载评论信息
      commit(types.STORE_APPREC_COMMENT, response.data.comments)
    }).catch(error => {
      commit(types.TOGGLE_LOADING_STATUS)
      Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
      Promise.reject(error)
    })
    // 加载用户关注状态
    s.isLogined && await dispatch('getApprecAuthorFollowed', state.apprec.user.id)
  },
  // 获取用户对该品鉴的点赞、收藏、评分状态与品鉴的平均评分
  async getApprecStatus({commit}, apprec) {
    // 并发请求
    axios.all([getApprecVoted(apprec), getApprecFavored(apprec), getApprecRated(apprec), getApprecRating(apprec)])
    .then(axios.spread((voted, favored, rated, rating) => {
      commit(types.TOGGLE_APPREC_VOTED, voted.data.voted)
      commit(types.TOGGLE_APPREC_FAVORED, favored.data.favored)
      commit(types.STORE_APPREC_RATING, rated.data.rated)
      commit(types.LOAD_APPREC_RATING, rating.data.rating)
    }))
  },
  // 获取该品鉴作者的关注状态
  getApprecAuthorFollowed({commit}, user) {
    api.get(`user/${user}/followed`).then(response => {
      commit(types.TOGGLE_APPREC_AUTHOR_FOLLOWED, response.data.followed)
    })
  },
  // 获取该品鉴的所有评论
  getApprecComments({commit}, apprec) {
    api.get(`appreciation/${apprec}/comments`).then(response => {
      commit(types.STORE_APPREC_COMMENT, response.data)
    })
  },
  // 切换品鉴点赞的状态
  async toggleApprecVoted({commit, dispatch}, apprec) {
    if (c.notLogged()) {
      await api.post('appreciation/vote', {'appreciation': apprec}).then(response => {
        commit(types.TOGGLE_APPREC_VOTED, response.data.voted)
      }).catch(error => {
        Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
        Promise.reject(error)
      })
    }
  },
  // 切换品鉴收藏的状态
  async toggleApprecFavored({commit}, apprec) {
    if (c.notLogged()) {
      await api.post('appreciation/favorite', {'appreciation': apprec}).then(response => {
        commit(types.TOGGLE_APPREC_FAVORED, response.data.favored)
      }).catch(error => {
        Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
        Promise.reject(error)
      })
    }
  },
  // 切换作者的关注状态
  async toggleAuthorFollowed({commit}, user) {
    if (c.notLogged()) {
      await api.post('user/follow', {'user': user}).then(response => {
        commit(types.TOGGLE_APPREC_AUTHOR_FOLLOWED, response.data.followed)
      }).catch(error => {
        Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
        Promise.reject(error)
      })
    }
  },
  // 存储品鉴评论内容
  storeApprecComment({commit}, comment) {
    if (c.notLogged()) {
      api.post('appreciation/comment', comment).then(response => {
        commit(types.STORE_APPREC_COMMENT, response.data)
        Message({message: '评论成功。', type: 'success', customClass: 'c-msg'})
      }).catch(error => {
        Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
        Promise.reject(error)
      })
    }
  },
  // 存储品鉴评分
  storeApprecRated({commit}, rating) {
    if (c.notLogged()) {
      api.post('appreciation/rating', rating).then(response => {
        commit(types.STORE_APPREC_RATING, response.data.rated)
        Message({message: '评分成功。', type: 'success', customClass: 'c-msg'})
      }).catch(error => {
        Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
        Promise.reject(error)
      })
    }
  },
  storeApprecCurrentPage({commit}, currentPage) {
    commit(types.STORE_APPREC_CURRENTPAGE, currentPage)
  },
  storeApprecLastPage({commit}, lastPage) {
    commit(types.STORE_APPREC_LASTPAGE, lastPage)
  }
}
const mutations = {
  [types.LOAD_APPRECLIST](state, apprecs) {
    if (!state.apprecCurrentPage) {
      state.apprecs = apprecs
    } else {
      state.apprecs = state.apprecs.concat(apprecs)
    }
  },
  [types.LOAD_APPREC](state, apprec) {
    state.apprec = apprec
  },
  [types.STORE_APPREC_CURRENTPAGE](state, currentPage) {
    state.apprecCurrentPage = currentPage
  },
  [types.STORE_APPREC_LASTPAGE](state, lastPage) {
    state.apprecLastPage = lastPage
  },
  [types.LOAD_APPREC_RATING](state, rating) {
    state.apprecStatus.rating = rating
  },
  [types.TOGGLE_APPREC_VOTED](state, voted) {
    state.apprecStatus.voted = voted
  },
  [types.TOGGLE_APPREC_FAVORED](state, favored) {
    state.apprecStatus.favored = favored
  },
  [types.TOGGLE_APPREC_AUTHOR_FOLLOWED](state, followed) {
    state.apprecStatus.followed = followed
  },
  [types.STORE_APPREC_RATING](state, rated) {
    state.apprecStatus.rated = rated
  },
  [types.STORE_APPREC_COMMENT](state, comment) {
    // 如果是赋值行为，即加载评论内容
    if (Object.prototype.toString.call(comment) === '[object Array]') {
      state.apprecStatus.comments = comment
    } else if (!comment) { // 如果无评论
      state.apprecStatus.comments = []
    } else { // 如果是存储评论行为
      state.apprecStatus.comments.unshift(comment)
    }
  }
}

// 获取该品鉴的点赞状态
function getApprecVoted (apprec) {
  return api.get(`appreciation/${apprec}/voted`)
}
// 获取该品鉴的收藏状态
function getApprecFavored (apprec) {
  return api.get(`appreciation/${apprec}/favored`)
}
// 获取该品鉴用户的评分状态
function getApprecRated(apprec) {
  return api.get(`appreciation/${apprec}/rated`)
}
// 获取该品鉴的评分
function getApprecRating (apprec) {
  return api.get(`appreciation/${apprec}/rating`)
}

export default {
  state,
  getters,
  actions,
  mutations
}
