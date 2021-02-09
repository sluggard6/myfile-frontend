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
    method: 'put',
    params: name
  })
}

export function checkFolderName(id, name) {
  return request({
    url: 'folder/check',
    method: 'get',
    params: {
      id: id,
      name: name
    }
  })
}
