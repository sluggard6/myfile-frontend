<template>
  <el-dialog :title="title" :visible.sync="innerVisible">
    <el-tabs tab-position="left" style="margin-bottom: 30px;">
      <el-tab-pane label="共享给用户">
        <el-form>
          <el-select
            v-model="users"
            multiple
            filterable
            remote
            reserve-keyword
            class="inline-input"
            :remote-method="querySearch"
            placeholder="请输入内容"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :value="item.username"
            />
          </el-select>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="共享给呵呵">共享给呵呵</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
export default {
  name: 'ShareDialog',
  props: {
    title: {
      type: String,
      default: 0
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      users: [],
      options: [],
      loading: false,
      innerVisible: false
    }
  },
  created(){
    this.innerVisible = this.visible
  },
  methods: {
    async querySearch(queryString) {
      this.loading = true
      const res = await queryLike(queryString)
      console.log(res)
      this.loading = false
      this.options = res.data
    },
  },
  watch: {
    innerVisible: function() {
      console.log(this.innerVisible)
      this.$emit('update:visible', this.innerVisible)
    }
  }
}
</script>
