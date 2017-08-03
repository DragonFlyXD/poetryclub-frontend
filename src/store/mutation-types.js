// 检验登录状态
export const CHECKOUT_LOGIN_STATUS = 'CHECKOUT_LOGIN_STATUS'
// 改变 Loading 状态
export const TOGGLE_LOADING_STATUS = 'TOGGLE_LOADING_STATUS'
// 退出登录
export const USER_LOGOUT = 'USER_LOGOUT'
// 加载个人信息
export const LOAD_PROFILE = 'profile/LOAD_PROFILE'
// 更新个人头像
export const UPDATE_AVATAR = 'profile/UPDATE_AVATAR'
// 加载诗文信息、诗文列表、诗文评分
export const LOAD_POEM = 'poem/LOAD_POEM'
export const LOAD_POEMLIST = 'poem/LOAD_POEMLIST'
export const LOAD_POEM_RATING = 'poem/LOAD_POEM_RATING'
// 获取诗文列表当前页数、最后一页
export const GET_POEM_CURRENTPAGE = 'poem/GET_POEM_CURRENTPAGE'
export const GET_POEM_LASTPAGE = 'poem/GET_POEM_LASTPAGE'
// 切换诗文的点赞、收藏、诗文作者关注的状态
export const TOGGLE_POEM_VOTED = 'poem/TOGGLE_POEM_VOTED'
export const TOGGLE_POEM_FAVORED = 'poem/TOGGLE_POEM_FAVORED'
export const TOGGLE_POEM_AUTHOR_FOLLOWED = 'TOGGLE_POEM_AUTHOR_FOLLOWED'
// 存储诗文评分、诗文评论
export const STORE_POEM_RATING = 'poem/STORE_POEM_RATING'
export const STORE_POEM_COMMENT = 'poem/STORE_POEM_COMMENT'
// 创建诗文
export const STORE_POEM = 'poem/STORE_POEM'
// 获取私信列表、对话列表，删除对话、私信内容
export const LOAD_INBOX_MESSAGES = 'inbox/LOAD_INBOX_MESSAGES'
export const LOAD_INBOX_DIALOG = 'inbox/LOAD_INBOX_DIALOG'
export const DELETE_INBOX_DIALOG = 'inbox/DELETE_INBOX_DIALOG'
export const DELETE_INBOX_MESSAGE = 'inbox/DELETE_INBOX_MESSAGES'
// 存储私信内容
export const STORE_INBOX_MESSAGE = 'inbox/STORE_INBOX_MESSAGE'
export const STORE_DIALOG_MESSAGE = 'inbox/STORE_DIALOG_MESSAGE'
// 加载检索的诗文列表
export const SCOUT_POEMLIST = 'scout/SCOUT_POENLIST'
