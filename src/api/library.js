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

export function checkLibraryName(name) {
  return request({
    url: '/library/check',
    method: 'get',
    params: {
      name
    }
  })
}

export function createLibrary(name) {
  return request({
    url: '/library',
    method: 'put',
    params: {
      name
    }
  })
}

export function deleteLibrary(id) {
  return request({
    url: '/library/' + id,
    method: 'delete'
  })
}
