<template>
  <div class="app-container">
    <h3>详情页面{{ folderId }}</h3>
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
  methods: {
    async getFolders() {
      const res = await getChildren(this.folderId)
      this.folders = res.data.folders
      this.files = res.data.files
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
