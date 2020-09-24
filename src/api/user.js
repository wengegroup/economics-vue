import axios from './index'


const userApi = {
  // 获取用户
  getUser : req => {
    return axios.dispatch('get', axios.baseUrl.user + '/getUser/getAll', {
      params: req
    }).then(res => {
      return Promise.resolve(res.data)
    })
  },
  //增加用户
  addUser:req => {
    return axios.dispatch('post', axios.baseUrl.user + '/addUser', {
      params: req
    }).then(res => {
      return Promise.resolve(res.data)
    })
  },
}

export default userApi
