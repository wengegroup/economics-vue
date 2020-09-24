import axios from 'axios'

import {
  getSession
} from "@/utils/assist";
const apiRoot = process.env.API_ROOT;
const ssoLog = process.env.SSO_LOG;


let config = {
  // headers: {
  //   'Cache-Control': 'no-cache',
  //   'Pragma': 'no-cache'
  // },
  // 超时设置
  timeout: 30000,
  crossDomain: true,
  // 跨域是否带Token
  withCredentials: true,
  // 响应的数据格式 json / blob /document /arraybuffer / text / stream
  responseType: 'json'
}

let service = axios.create(config)

// 请求拦截
service.interceptors.request.use()

const catchErr = function (data) {
  if (data.code && data.code == 4015) {
    window.vm.$Message.destroy()
    window.vm.$Message.error(data.message)
    window.vm.$router.push({
      name: 'changepwd',
      query: {
        change: 1
      }
    });
    return
  }
  window.vm.$Message.destroy()
  window.vm.$Message.error(data.message)


}

// 相应拦截
service.interceptors.response.use(
  (response) => {
    return Promise.resolve(response)
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          catchErr(err.response.data)
          // vueInstence.$Message.destroy()
          // vueInstence.$Message.error(err.response.data.error_description)
          // catchErr(err.response.data.code, err.response.data.message)
          break
        case 401:
          let userInfo = getSession('userInfo');
          if (userInfo) {
            window.vm.$Message.destroy()
            window.vm.$Message.error('登录过期')
          }
          window.vm.$router.push({
            name: 'login'
          })
          break
        case 403:
          window.vm.$Message.destroy()
          window.vm.$Message.error('没有权限')
          break
        case 500:
          window.vm.$Message.destroy()
          window.vm.$Message.error('服务器错误')
          break
      }
    }
    return Promise.reject(err)
  }
)

export default {
  async dispatch(method = 'get', url, param = {}, headers = {}, responseType = 'json') {
    let params = (method === 'get' || method === 'delete') ? 'params' : 'data'
    return service({
      method: method,
      url: url,
      [params]: param.params,
      headers: headers,
      responseType: responseType
    })
  },
  baseUrl: {
    user: apiRoot,

  },
  instance: service
}
