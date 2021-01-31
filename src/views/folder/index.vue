<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark">详情页面{{ folderId }}</div></el-col>
    </el-row>
    <el-table :data="children" style="width: 100%" highlight-current-row @cell-mouse-enter="optionShow" @cell-mouse-leave="optionHide">
      <el-table-column type="selection" width="55" />
      <el-table-column label="名称" width="120">
        <template slot-scope="{row}">
          <router-link v-if="row.isFolder" :to="'/folder/'+row.id">
            <el-link class="link-type">{{ row.name }}</el-link>
          </router-link>
          <router-link v-else :to="'/file/'+row.id">
            <el-link class="link-type">{{ row.name }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="120">
        <template slot-scope="{row}">
          <div v-if="row.isFolder">-</div>
          <div v-else>{{ row.size }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" show-overflow-tooltip>
        <template slot-scope="{row}">
          <transition name="el-fade-in">
            <div v-show="row.display">
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
            </div>
          </transition>
        </template>
      </el-table-column>
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
            :before-remove="beforeRemove"
            :with-credentials="withCredentials"
            :show-file-list="false"
          >
            <el-button type="primary" style="margin-right: 10px;">上传文件</el-button>
          </el-upload>
          <el-button type="primary">上传22...</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getChildren } from '@/api/folder'
import { Message } from 'element-ui'

export default {
  name: 'Folder',
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
      base_api: process.env.VUE_APP_BASE_API
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
      // this.folders = res.data.folders
      // this.files = res.data.files
      console.log(res)
      this.children = res.data.folders.map(function(obj, index) {
        obj.isFolder = true
        obj.show = false
        return obj
      // }).concat(res.data.files)
      }).concat(res.data.files.map(function(obj, index) {
        obj.isFolder = false
        obj.show = false
        return obj
      }))
      // this.children = res.data.folders.concat(res.data.files)
      console.log(this.children)
    },
    optionShow(row) {
      row.display = true
    },
    optionHide(row) {
      row.display = false
    },
    handleSuccess(res, file, fileList) {
      console.log(res)
      if (res.code !== 0) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    handleRemove() {
      console.log('---------handleRemove---------')
    },
    beforeRemove() {
      console.log('---------beforeRemove---------')
    },
    handlePreview() {
      console.log('---------handlePreview---------')
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
</style>
