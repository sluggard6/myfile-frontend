<template>
  <div class="app-container">
    <h3>详情页面</h3>
    <el-table :data="folders" style="width: 100%" highlight-current-row @cell-mouse-enter="optionShow" @cell-mouse-leave="optionHide">
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'Folder',
  data() {
    return ({
      folders: [],
      files: []
    })
  }
}
</script>
<style lang="scss" scoped>
</style>