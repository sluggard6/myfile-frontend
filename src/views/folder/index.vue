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
  },
  methods: {
    async getFolders() {
      const res = await getFolders('mine')
      this.librarys = res.data
      this.librarys.forEach(e => {
        // e.active = false
        this.$set(e, 'active', false)
        this.$set(e, 'display', false)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>