<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in path" :key="item.id">
            <span v-if="index==path.length-1" class="no-redirect">{{ pathName(item.name, index) }}</span>
            <router-link v-else :to="'/folder/'+item.id">
              <el-link class="link-type">{{ pathName(item.name, index) }}</el-link>
            </router-link>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-table :data="children" style="width: 100%" highlight-current-row @cell-mouse-enter="optionShow" @cell-mouse-leave="optionHide">
      <el-table-column type="selection" width="55" />
      <el-table-column label="名称" width="250">
        <template slot-scope="{row}">
          <router-link v-if="row.isFolder" :to="'/folder/'+row.id">
            <el-link class="link-type">{{ row.name }}</el-link>
          </router-link>
          <el-link v-else class="link-type" @click="openFile(row)">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="120">
        <template slot-scope="{row}">
          <div v-if="row.isFolder">-</div>
          <div v-else>{{ formatSize(row.size, 1) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" show-overflow-tooltip>
        <template slot-scope="{row}">
          <transition name="el-fade-in">
            <div v-show="row.optionDisplay">
              <el-tooltip effect="light" placement="top" content="分享" transition="el-fade-in">
                <div class="icon-item">
                  <i class="el-icon-share" @click="{dialogShow=true;title='共享资料库'+row.name}" />
                </div>
              </el-tooltip>
              <el-tooltip effect="light" placement="top" content="编辑" transition="el-fade-in">
                <div class="icon-item">
                  <i class="el-icon-edit" @click="folderEditDialog=true;folderName=row.name;isCreateFolder=false;currentRow=row" />
                </div>
              </el-tooltip>
              <el-tooltip effect="light" placement="top" content="删除" transition="el-fade-in">
                <div class="icon-item">
                  <i class="el-icon-delete-solid" />
                </div>
              </el-tooltip>
              <el-tooltip effect="light" placement="top" content="下载" transition="el-fade-in">
                <div class="icon-item">
                  <i class="el-icon-download" />
                </div>
              </el-tooltip>
            </div>
          </transition>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip />
    </el-table>
    <el-row>
      <el-col>
        <div class="el-button-row">
          <el-upload
            ref="upload"
            action=""
            class="upload-demo"
            :http-request="submit"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :with-credentials="true"
            :show-file-list="false"
          >
            <el-button type="primary" style="margin-right: 10px;">上传文件</el-button>
          </el-upload>
          <el-button type="primary" @click="folderEditDialog=true;isCreateFolder=true;folderName=''">新建文件夹</el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="(isCreateFolder?'创建':'重命名')+'文件夹'" :visible.sync="folderEditDialog">
      <el-form label-width="120px">
        <el-form-item label="Folder Name">
          <el-input v-model="folderName" placeholder="请输入文件夹名称" clearable @focus="checkedName=false" @blur="chekcName" @clear="checkedName=false" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!checkedName" @click="isCreateFolder?createFolder():editFolder()">确定</el-button>
          <el-button @click="folderEditDialog=false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="上传进度"
      :visible="progressShow"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-progress :percentage="progress" />
    </el-dialog>
    <file-player :dialog-show.sync="dialogShow" :title="fileName" :type="fileType" :url="fileUrl" />
  </div>
</template>
<script>
import FilePlayer from '@/components/Player'
import { getChildren, createFolder, checkFolderName, editFolder } from '@/api/folder'
import { formatSize } from '@/utils/file'
import { Message } from 'element-ui'
import axios from 'axios'

export default {
  name: 'Folder',
  comments: {
    FilePlayer
  },
  components: { FilePlayer },
  data() {
    return ({
      folderId: this.$route.params.id,
      children: [],
      path: [],
      libraryName: 'Default Library',
      imagecropperShow: false,
      show: false,
      // withCredentials: true,
      // params: {
      //   folderId: this.$route.params.id
      // },
      base_api: process.env.VUE_APP_BASE_API,
      dialogShow: false,
      fileName: '',
      checkedName: false,
      folderName: '',
      folderEditDialog: false,
      isCreateFolder: false,
      currentRow: null,
      fileType: '',
      fileUrl: '',
      progressShow: false,
      progress: 0
    })
  },
  watch: {
    isCreateFolder: function(newVal, oldVal) {
      if (newVal) {
        this.folderEditDialogTitle = '创建文件夹'
      } else {
        this.folderEditDialogTitle = '编辑文件夹'
      }
    },
    folderEditDialog: function(newVal) {
      if (!newVal) {
        this.currentRow = null
      }
    }
  },
  created() {
    this.getFolders()
  },
  mounted() {
    this.base_api = process.env.VUE_APP_BASE_API
  },
  methods: {
    async getFolders() {
      const res = await getChildren(this.folderId)
      const c = res.data.children
      this.path = res.data.path
      this.libraryName = res.data.libraryName
      this.children = c.folders.map(function(obj, index) {
        obj.isFolder = true
        obj.show = false
        obj.optionDisplay = false
        return obj
      }).concat(c.files.map(function(obj, index) {
        obj.isFolder = false
        obj.show = false
        obj.optionDisplay = false
        return obj
      }))
    },
    openFile(row) {
      this.fileName = row.name
      this.dialogShow = true
      this.fileType = this.fileFilter(row.ext)
      this.fileUrl = this.base_api + 'file/' + row.id + '/' + row.name
    },
    optionShow(row) {
      row.optionDisplay = true
    },
    optionHide(row) {
      row.optionDisplay = false
    },
    submit(data) {
      console.log(data)
      // const files = this.$refs.upload.uploadFiles
      if (data !== undefined) {
        const fd = new FormData()
        // files.forEach(item => {
        //   fd.append('files', item.raw, item.name)
        // })
        fd.append('file', data.file)
        fd.append('folderId', this.folderId)
        this.progressShow = true
        this.progress = this.loaded = this.total = 0
        axios({
          url: this.base_api + 'file/upload',
          method: 'post',
          withCredentials: true,
          // params: this.params,
          onUploadProgress: pe => {
            console.log(pe)
            this.progress = Number.parseInt((pe.loaded / pe.total) * 100)
            this.loaded = pe.loaded
            this.total = pe.total
          },
          data: fd,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          // this.$message.success('上传成功')
          this.handleSuccess(res.data, data.file, data.fileList)
          this.$refs.upload.clearFiles()
          this.progressShow = false
        }).catch(_ => {
          this.$message.error('上传失败')
          this.$refs.upload.clearFiles()
          this.progressShow = false
        })
      } else {
        this.$message.warning('至少选择一个文件')
      }
    },
    handleSuccess(res, file, fileList) {
      if (res.code !== 0) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      const resFile = res.data
      resFile.isFolder = false
      resFile.show = false
      resFile.optionDisplay = false
      this.children.push(resFile)
      Message({
        message: '上传成功',
        type: 'success',
        duration: 5 * 1000
      })
    },
    formatSize(size, pointLength, units) {
      return formatSize(size, pointLength, units)
    },
    handlePreview() {

    },
    handleRemove() {

    },
    async chekcName() {
      if (this.folderName === '') { return }
      const res = await checkFolderName(this.folderId, this.folderName)
      this.checkedName = res.data
      if (!this.checkedName) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    async createFolder() {
      await createFolder(this.folderId, this.folderName)
      this.getFolders()
      this.folderEditDialog = false
    },
    async editFolder() {
      await editFolder(this.folderId, this.currentRow.id, this.folderName)
      this.getFolders()
      this.folderEditDialog = false
    },
    fileFilter: function(ext) {
      ext = ext.toLowerCase()
      switch (ext) {
        case '.txt': return 'TXT'
        case '.mp4': return 'VIDEO'
        case '.png':
        case '.jpg': return 'IMG'
        default: {
          return 'DEFAULT'
        }
      }
    },
    pathName: function(name, index) {
      if (index === 0) {
        return this.libraryName
      } else {
        return name
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-button-row {
    display: flex;
    justify-content: flex-end;
    padding: 5px;
  }
  .icon-item {
    // margin: 0px;
    // height: 35px;
    text-align: center;
    width: 30px;
    float: left;
    font-size: 20px;
    color: #24292e;
    cursor: pointer;
  }
</style>
