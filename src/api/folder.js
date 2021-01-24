import request from '@/utils/request'

export function getChildren(id) {
  return request({
    url: 'folder/' + id,
    method: 'get'
  })
}
