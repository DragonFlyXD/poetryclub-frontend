import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import * as types from '../store/mutation-types'

// 首页相关
import Home from '@/pages/home'

// 用户相关
import UserLogin from '@/pages/user/Login.vue'
import UserRegister from '@/pages/user/Register.vue'
import UserProfile from '@/pages/user/Profile.vue'
import UserReset from '@/pages/user/Reset.vue'
import UserFollow from '@/pages/user/Follow.vue'
import UserWork from '@/pages/user/Work.vue'

// 诗库相关
import Poem from '@/pages/poem'
import PoemView from '@/pages/poem/view.vue'
import CreatePoem from '@/pages/poem/create.vue'

// 私信相关
import Inbox from '@/pages/inbox'
import InboxDialog from '@/pages/inbox/Dialog.vue'

// 搜索相关
import Scout from '@/pages/scout'

// 邮件相关
import Email from '@/pages/email'

// 反馈
import Feedback from '@/pages/feedback'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/user/login',
      name: 'userLogin',
      component: UserLogin
    }, {
      path: '/user/register',
      name: 'userRegister',
      component: UserRegister
    }, {
      path: '/user/profile',
      name: 'userProfile',
      component: UserProfile,
      meta: {
        requiresAuth: true
      }
    }, {
      path: '/user/reset',
      name: 'userReset',
      component: UserReset,
      meta: {
        requiresAuth: true
      }
    }, {
      path: '/user/:name([\\u4E00-\\u9FFFa-zA-Z0-9_-]{2,20})',
      name: 'userCenter',
      component: UserProfile
    }, {
      path: '/user/:name([\\u4E00-\\u9FFFa-zA-Z0-9_-]{2,20})/followers',
      name: 'userFollower',
      component: UserFollow
    }, {
      path: '/user/:name([\\u4E00-\\u9FFFa-zA-Z0-9_-]{2,20})/followings',
      name: 'userFollowing',
      component: UserFollow
    }, {
      path: '/user/:name([\\u4E00-\\u9FFFa-zA-Z0-9_-]{2,20})/works',
      name: 'userWork',
      component: UserWork
    }, {
      path: '/poem',
      name: 'poem',
      component: Poem
    }, {
      path: '/poem/:poem_id(\\d+)',
      name: 'poemView',
      component: PoemView
    }, {
      path: '/poem/create',
      name: 'createPoem',
      component: CreatePoem,
      meta: {
        requiresAuth: true
      }
    }, {
      path: '/inbox',
      name: 'inbox',
      component: Inbox,
      meta: {
        requiresAuth: true
      }
    }, {
      path: '/inbox/:id(\\d+)',
      name: 'inboxDialog',
      component: InboxDialog,
      meta: {
        requiresAuth: true
      }
    }, {
      path: '/scout',
      name: 'scout',
      component: Scout
    }, {
      path: '/email/verify',
      name: 'emailVerify',
      component: Email
    }, {
      path: '/feedback',
      name: 'feedback',
      component: Feedback
    }
  ]
})

// 导航钩子
router.beforeEach((to, from, next) => {
  // 检查登录状态
  store.commit(types.CHECKOUT_LOGIN_STATUS)
  if (to.matched.some(record => record.meta.requiresAuth)) { // 判断该路由是否需要登录权限
    if (window.localStorage.ACCESS_TOKEN) { // 如果本地存在 access_token，则继续导航
      next()
    } else {
      next({
        path: '/user/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})

export default router
