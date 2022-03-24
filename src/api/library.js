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

export function editLibrary(id, name) {
  return request({
    url: '/library',
    method: 'post',
    data: {
      id: id,
      name: name
    }
  })
}

export function deleteLibrary(id) {
  return request({
    url: '/library/' + id,
    method: 'delete'
  })
}

export function removeShare(id, userId) {
  console.log(id, userId)
  return request({
    url: '/library/share',
    method: 'delete',
    data: {
      id: id,
      ownerId: userId
    }
  })
}

export function shareLibrary(id, users, role) {
  return request({
    url: '/library/share',
    method: 'put',
    data: {
      id: id,
      users: users,
      role: role
    }
  })
}
