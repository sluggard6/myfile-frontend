<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark">详情页面{{ folderId }}</div></el-col>
    </el-row>
    <el-table :data="children" style="width: 100%" highlight-current-row>
      <el-table-column type="selection" width="55" />
      <el-table-column label="名称" width="120">
        <template slot-scope="{row}">
          <router-link :to="'/folder/1'">
            <el-link class="link-type">{{ row.name }}</el-link>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-row>
      <el-col>
        <div class="el-button-row">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button type="primary" style="margin-right: 10px;">上传文件</el-button>
          </el-upload>
          <el-button type="primary">上传22...</el-button>
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>
<script>
import { getChildren } from '@/api/folder'

export default {
  name: 'Folder',
  data() {
    return ({
      folderId: this.$route.params.id,
      children: []
    })
  },
  created() {
    this.getFolders()
  },
  methods: {
    async getFolders() {
      const res = await getChildren(this.folderId)
      // this.folders = res.data.folders
      // this.files = res.data.files
      console.log(res)
      this.children = res.data.folders.concat(res.data.files)
      console.log(this.children)
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
