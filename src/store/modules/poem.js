import * as types from '../mutation-types'
import s from '../state'
import api from '@/api'
import axios from 'axios'
import {Message} from 'element-ui'
import router from '../../router'
import c from '@/common/js'

const state = {
  poems: [], // 诗文列表
  poem: {}, // 指定诗文
  poemCurrentPage: 0, // 诗文列表当前页数
  poemLastPage: 0, // 诗文列表最后一页
  poemStatus: {
    voted: false, // 是否赞过诗文
    favored: false, // 是否收藏过诗文
    appreciated: false, // 是否品鉴过该诗文
    rated: 0, // 是否评分过诗文
    followed: false, // 是否关注诗文作者
    comments: [], // 诗文评论
    rating: 0  // 诗文评分
  }
}

const getters = {
  poems: state => state.poems,
  poem: state => state.poem,
  poemStatus: state => state.poemStatus,
  poemLastPage: state => state.poemLastPage,
  poemCurrentPage: state => state.poemCurrentPage
}
const actions = {
  // 加载诗文列表
  async loadPoemList({commit, state}, quit = false) {
    commit(types.TOGGLE_LOADING_STATUS, quit)
    await api.get(`poem?page=${state.poemCurrentPage + 1}`).then(response => {
      commit(types.TOGGLE_LOADING_STATUS, quit)
      // 获取诗文列表数据
      commit(types.LOAD_POEMLIST, response.data.data)
      // 获取分页最后一页
      !state.poemCurrentPage && commit(types.STORE_POEM_LASTPAGE, response.data.last_page)
      // 获取当前页数
      commit(types.STORE_POEM_CURRENTPAGE, response.data.current_page)
    }).catch(error => {
      commit(types.TOGGLE_LOADING_STATUS, quit)
      Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
      Promise.reject(error)
    })
  },
  // 加载指定诗文信息
  async loadPoem({commit, dispatch, state}, path) {
    commit(types.TOGGLE_LOADING_STATUS)
    // 获取诗文ID
    const poem = path.match(/(\d+)$/)[0]
    // 获取用户对该诗文的点赞、收藏、评分状态与诗文的平均评分
    s.isLogined && await dispatch('getPoemStatus', poem)
    // 获取诗文主要信息
    await api.get(path).then(response => {
      commit(types.TOGGLE_LOADING_STATUS)
      // 如果未找到指定诗文，则重定向至404页面
      if (response.data.error) {
        response.data.error.http_code === 404 && router.push({name: '404'})
      }
      // 加载诗文数据与作者数据
      commit(types.LOAD_POEM, response.data)
      // 若用户已登录，获取其品鉴状态
      if (s.isLogined) {
        commit(types.STORE_POEM_APPRECIATED, response.data.appreciated)
      }
      // 加载评论信息
      commit(types.STORE_POEM_COMMENT, response.data.comments)
    }).catch(error => {
      commit(types.TOGGLE_LOADING_STATUS)
      Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
      Promise.reject(error)
    })
    // 加载用户关注状态
    s.isLogined && await dispatch('getPoemAuthorFollowed', state.poem.user.id)
  },
  // 获取用户对该诗文的点赞、收藏、评分状态与诗文的平均评分
  async getPoemStatus({commit}, poem) {
    // 并发请求
    axios.all([getPoemVoted(poem), getPoemFavored(poem), getPoemRated(poem), getPoemRating(poem)])
    .then(axios.spread((voted, favored, rated, rating) => {
      commit(types.TOGGLE_POEM_VOTED, voted.data.voted)
      commit(types.TOGGLE_POEM_FAVORED, favored.data.favored)
      commit(types.STORE_POEM_RATING, rated.data.rated)
      commit(types.LOAD_POEM_RATING, rating.data.rating)
    }))
  },
  // 获取该诗文作者的关注状态
  getPoemAuthorFollowed({commit}, user) {
    api.get(`user/${user}/followed`).then(response => {
      commit(types.TOGGLE_POEM_AUTHOR_FOLLOWED, response.data.followed)
    })
  },
  // 获取该诗文的所有评论
  getPoemComments({commit}, poem) {
    api.get(`poem/${poem}/comments`).then(response => {
      commit(types.STORE_POEM_COMMENT, response.data)
    })
  },
  // 切换诗文点赞的状态
  async togglePoemVoted({commit, dispatch}, poem) {
    if (c.notLogged()) {
      await api.post('poem/vote', {'poem': poem}).then(response => {
        commit(types.TOGGLE_POEM_VOTED, response.data.voted)
      }).catch(error => {
        Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
        Promise.reject(error)
      })
    }
  },
  // 切换诗文收藏的状态
  async togglePoemFavored({commit}, poem) {
    if (c.notLogged()) {
      await api.post('poem/favorite', {'poem': poem}).then(response => {
        commit(types.TOGGLE_POEM_FAVORED, response.data.favored)
      }).catch(error => {
        Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
        Promise.reject(error)
      })
    }
  },
  // 切换作者的关注状态
  async togglePoemAuthorFollowed({commit}, user) {
    if (c.notLogged()) {
      await api.post('user/follow', {'user': user}).then(response => {
        commit(types.TOGGLE_POEM_AUTHOR_FOLLOWED, response.data.followed)
      }).catch(error => {
        Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
        Promise.reject(error)
      })
    }
  },
  // 存储诗文评论内容
  storePoemComment({commit}, comment) {
    if (c.notLogged()) {
      api.post('poem/comment', comment).then(response => {
        commit(types.STORE_POEM_COMMENT, response.data)
        Message({message: '评论成功。', type: 'success', customClass: 'c-msg'})
      }).catch(error => {
        Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
        Promise.reject(error)
      })
    }
  },
  // 存储诗文评分
  storePoemRated({commit}, rating) {
    if (c.notLogged()) {
      api.post('poem/rating', rating).then(response => {
        commit(types.STORE_POEM_RATING, response.data.rated)
        Message({message: '评分成功。', type: 'success', customClass: 'c-msg'})
      }).catch(error => {
        Message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
        Promise.reject(error)
      })
    }
  },
  storePoemCurrentPage({commit}, currentPage) {
    commit(types.STORE_POEM_CURRENTPAGE, currentPage)
  },
  storePoemLastPage({commit}, lastPage) {
    commit(types.STORE_POEM_LASTPAGE, lastPage)
  }
}
const mutations = {
  [types.LOAD_POEMLIST](state, poems) {
    if (!state.poemCurrentPage) {
      state.poems = poems
    } else {
      state.poems = state.poems.concat(poems)
    }
  },
  [types.LOAD_POEM](state, poem) {
    state.poem = poem
  },
  [types.STORE_POEM_CURRENTPAGE](state, currentPage) {
    state.poemCurrentPage = currentPage
  },
  [types.STORE_POEM_LASTPAGE](state, lastPage) {
    state.poemLastPage = lastPage
  },
  [types.LOAD_POEM_RATING](state, rating) {
    state.poemStatus.rating = rating
  },
  [types.TOGGLE_POEM_VOTED](state, voted) {
    state.poemStatus.voted = voted
  },
  [types.TOGGLE_POEM_FAVORED](state, favored) {
    state.poemStatus.favored = favored
  },
  [types.STORE_POEM_APPRECIATED](state, appreciated) {
    state.poemStatus.appreciated = appreciated
  },
  [types.TOGGLE_POEM_AUTHOR_FOLLOWED](state, followed) {
    state.poemStatus.followed = followed
  },
  [types.STORE_POEM_RATING](state, rated) {
    state.poemStatus.rated = rated
  },
  [types.STORE_POEM_COMMENT](state, comment) {
    // 如果是赋值行为，即加载评论内容
    if (Object.prototype.toString.call(comment) === '[object Array]') {
      state.poemStatus.comments = comment
    } else if (!comment) { // 如果无评论
      state.poemStatus.comments = []
    } else { // 如果是存储评论行为
      state.poemStatus.comments.unshift(comment)
    }
  }
}

// 获取该诗文的点赞状态
function getPoemVoted (poem) {
  return api.get(`poem/${poem}/voted`)
}
// 获取该诗文的收藏状态
function getPoemFavored (poem) {
  return api.get(`poem/${poem}/favored`)
}
// 获取该诗文用户的评分状态
function getPoemRated(poem) {
  return api.get(`poem/${poem}/rated`)
}
// 获取该诗文的评分
function getPoemRating (poem) {
  return api.get(`poem/${poem}/rating`)
}

export default {
  state,
  getters,
  actions,
  mutations
}
