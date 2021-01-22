import request from '@/utils/request'

export function getLibrarys(type) {
  return request({
    url: '/library',
    method: 'get',
    params: {
      type
    }
  })
}
