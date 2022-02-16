<template>
  <el-dialog :title="title" :visible.sync="innerVisible">
    <el-tabs tab-position="left" style="margin-bottom: 30px;">
      <el-tab-pane label="共享给用户">
        <el-form>
          <el-row>
            <el-col :span="8">
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
            </el-col>
            <el-col :span="8">
              <el-select v-model="role" placeholder="权限">
                <el-option key="read" value="只读">只读</el-option>
                <el-option key="write" value="读写">读写</el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="shareLibrary">确定</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="共享给呵呵">共享给呵呵</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import { queryLike } from '@/api/user'
import { shareLibrary } from '@/api/library'
export default {
  name: 'ShareDialog',
  props: {
    title: {
      type: String,
      default: ''
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
      innerVisible: false,
      role: ''
    }
  },
  watch: {
    innerVisible: function() {
      this.$emit('update:visible', this.innerVisible)
    },
    visible: function() {
      this.innerVisible = this.visible
    }
  },
  methods: {
    async querySearch(queryString) {
      this.loading = true
      const res = await queryLike(queryString)
      this.loading = false
      this.options = res.data
    },
    async shareLibrary() {
      const res = await shareLibrary(id, users, role)
    }
  }
}
</script>
