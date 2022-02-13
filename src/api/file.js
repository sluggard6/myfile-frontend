import request from '@/utils/request'

export function upload(files) {
  return request({
    url: 'file/upload',
    method: 'post',
    onUploadProgress: pe => {
      this.progress = Number.parseInt((pe.loaded / pe.total) * 100)
      this.loaded = pe.loaded
      this.total = pe.total
    },
    data: files,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
