/* ------------------------  用户相关  ------------------------ */

// 检验登录状态
export const CHECKOUT_LOGIN_STATUS = 'CHECKOUT_LOGIN_STATUS'
// 退出登录
export const USER_LOGOUT = 'USER_LOGOUT'
// 加载个人信息
export const LOAD_PROFILE = 'profile/LOAD_PROFILE'
// 更新个人头像
export const UPDATE_AVATAR = 'profile/UPDATE_AVATAR'
// 远程搜索用户
export const FETCH_USER = 'user/FETCH_USER'

/* ------------------------------------------------------------------------ */

/* ------------------------  杂项  ------------------------ */

// 改变 Loading 状态
export const TOGGLE_LOADING_STATUS = 'TOGGLE_LOADING_STATUS'

/* ------------------------------------------------------------------------ */

/* ------------------------  品鉴相关  ------------------------ */

// 加载检索的内容列表
export const SCOUT_CONTENTLIST = 'scout/SCOUT_CONTENTLIST'

/* ------------------------------------------------------------------------ */

/* ------------------------  诗文相关  ------------------------ */

// 加载诗文信息、诗文列表、诗文评分
export const LOAD_POEM = 'poem/LOAD_POEM'
export const LOAD_POEMLIST = 'poem/LOAD_POEMLIST'
export const LOAD_POEM_RATING = 'poem/LOAD_POEM_RATING'
// 获取诗文列表当前页数、最后一页
export const STORE_POEM_CURRENTPAGE = 'poem/STORE_POEM_CURRENTPAGE'
export const STORE_POEM_LASTPAGE = 'poem/STORE_POEM_LASTPAGE'
// 切换诗文的点赞、收藏、诗文作者关注的状态
export const TOGGLE_POEM_VOTED = 'poem/TOGGLE_POEM_VOTED'
export const TOGGLE_POEM_FAVORED = 'poem/TOGGLE_POEM_FAVORED'
export const TOGGLE_POEM_AUTHOR_FOLLOWED = 'poem/TOGGLE_POEM_AUTHOR_FOLLOWED'
// 存储诗文评分、诗文评论
export const STORE_POEM_RATING = 'poem/STORE_POEM_RATING'
export const STORE_POEM_COMMENT = 'poem/STORE_POEM_COMMENT'
// 储存用户对诗文的品鉴状态
export const STORE_POEM_APPRECIATED = 'poem/STORE_POEM_APPRECIATED'

/* ------------------------------------------------------------------------ */

/* ------------------------  品鉴相关  ------------------------ */

// 加载品鉴信息、品鉴列表、品鉴评分
export const LOAD_APPREC = 'apprec/LOAD_APPREC'
export const LOAD_APPRECLIST = 'apprec/LOAD_APPRECLIST'
export const LOAD_APPREC_RATING = 'apprec/LOAD_APPREC_RATING'
// 获取品鉴列表当前页数、最后一页
export const STORE_APPREC_CURRENTPAGE = 'apprec/STORE_APPREC_CURRENTPAGE'
export const STORE_APPREC_LASTPAGE = 'apprec/GET_APPREC_LASTPAGE'
// 切换品鉴的点赞、收藏、品鉴作者关注的状态
export const TOGGLE_APPREC_VOTED = 'apprec/TOGGLE_APPREC_VOTED'
export const TOGGLE_APPREC_FAVORED = 'apprec/TOGGLE_APPREC_FAVORED'
export const TOGGLE_APPREC_AUTHOR_FOLLOWED = 'apprec/TOGGLE_APPREC_AUTHOR_FOLLOWED'
// 存储品鉴评分、品鉴评论
export const STORE_APPREC_RATING = 'apprec/STORE_APPREC_RATING'
export const STORE_APPREC_COMMENT = 'apprec/STORE_APPREC_COMMENT'

/* ------------------------------------------------------------------------ */

/* ------------------------  诗文相关  ------------------------ */

// 获取私信列表、对话列表，删除对话、私信内容
export const LOAD_INBOX_MESSAGES = 'inbox/LOAD_INBOX_MESSAGES'
export const LOAD_INBOX_DIALOG = 'inbox/LOAD_INBOX_DIALOG'
export const DELETE_INBOX_DIALOG = 'inbox/DELETE_INBOX_DIALOG'
export const DELETE_INBOX_MESSAGE = 'inbox/DELETE_INBOX_MESSAGES'
// 存储私信内容、对话内容
export const STORE_INBOX_MESSAGE = 'inbox/STORE_INBOX_MESSAGE'
export const STORE_DIALOG_MESSAGE = 'inbox/STORE_DIALOG_MESSAGE'
// 全部未读私信标志已读
export const MARK_READ_INBOX = 'inbox/MARK_READ_INBOX'

/* ------------------------------------------------------------------------ */
