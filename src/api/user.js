import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(id) {
  return request({
    url: '/user/info',
    method: 'get'
    // params: { token }
  })
}

export function queryLike(queryString) {
  return request({
    url: '/user/like',
    method: 'get',
    params: {
      queryString: queryString
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

