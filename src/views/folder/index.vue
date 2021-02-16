<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark">详情页面{{ folderId }}</div></el-col>
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
            class="upload-demo"
            :action="`${base_api}file/upload`"
            :data="params"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :with-credentials="withCredentials"
            :show-file-list="false"
          >
            <el-button type="primary" style="margin-right: 10px;">上传文件</el-button>
          </el-upload>
          <el-button type="primary" @click="folderEditDialog=true">新建文件夹</el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="创建文件夹" :visible.sync="folderEditDialog">
      <el-form label-width="120px">
        <el-form-item label="Folder Name">
          <el-input v-model="folderName" placeholder="请输入文件夹名称" clearable @focus="checkedName=false" @blur="chekcName" @clear="checkedName=false" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!checkedName" @click="createFolder">确定</el-button>
          <el-button @click="folderEditDialog=false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <file-player :dialog-show.sync="dialogShow" :title="fileName" :type="fileType" :url="fileUrl" />
  </div>
</template>
<script>
import FilePlayer from '@/components/Player'
import { getChildren, createFolder, checkFolderName } from '@/api/folder'
import { formatSize } from '@/utils/file'
import { Message } from 'element-ui'

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
      imagecropperShow: false,
      show: false,
      withCredentials: true,
      params: {
        folderId: this.$route.params.id
      },
      base_api: process.env.VUE_APP_BASE_API,
      dialogShow: false,
      fileName: '',
      checkedName: false,
      folderName: '',
      folderEditDialog: false,
      fileType: '',
      fileUrl: ''
    })
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
      console.log(res)
      const c = res.data.children
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
      const res = await createFolder(this.folderId, this.folderName)
      console.log(res)
    },
    fileFilter: function(ext) {
      ext = ext.toLowerCase()
      switch (ext) {
        case '.txt': return 'TXT'
        case '.mp4': return 'VIDEO'
        case '.jpg': return 'IMG'
        default: {
          return 'DEFAULT'
        }
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
