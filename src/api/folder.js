import request from '@/utils/request'

export function getChildren(id) {
  return request({
    url: 'folder/' + id,
    method: 'get'
  })
}

export function createFolder(id, name) {
  return request({
    url: 'folder/' + id,
    method: 'post',
    params: name
  })
}
