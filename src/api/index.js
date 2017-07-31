import axios from 'axios'
import config from './config'
import router from '@/router'

let api = axios.create(config)

// http request 拦截器
api.interceptors.request.use(config => {
  if (window.localStorage.ACCESS_TOKEN) {
    config.headers.Authorization = 'Bearer ' + window.localStorage.ACCESS_TOKEN
  }
  return config
}, error => {
  return Promise.reject(error)
})

// http response 拦截器
api.interceptors.response.use(response => {
  if (response.status === 401) { // token过期
    window.localStorage.removeItem('ACCESS_TOKEN')
    router.replace({
      path: '/user/login',
      query: {
        redirect: router.currentRoute.fullPath
      }
    })
  }
  return response
}, error => {
  return Promise.reject(error)
})

export default api
