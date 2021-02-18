<template>
  <el-dialog :title="title" :visible.sync="dialogShow">
    <el-tabs tab-position="left" style="margin-bottom: 30px;">
      <el-tab-pane label="共享给用户">
        <el-form>
          <el-select
            v-model="shareNames"
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
      type: Boolean,
      default: false
    }
  }
}
</script>
