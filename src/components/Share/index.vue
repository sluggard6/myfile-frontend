<template>
  <el-dialog :title="title" :visible.sync="innerVisible">
    <el-tabs tab-position="left" style="margin-bottom: 30px;">
      <el-tab-pane label="共享给用户">
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-select
                v-model="user"
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
              <el-select v-model="role" placeholder="权限" :change="roleOnchange()">
                <el-option value="1" label="只读">只读</el-option>
                <el-option value="2" label="读写">读写</el-option>
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
import { Message } from 'element-ui'
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
    },
    libraryId: {
      type: Number,
      default: 0,
      require: true
    }
  },
  data() {
    return {
      user: undefined,
      options: [],
      loading: false,
      innerVisible: false,
      role: undefined
    }
  },
  watch: {
    innerVisible: function() {
      if (this.innerVisible !== this.visible) {
        this.$emit('update:visible', this.innerVisible)
      }
    },
    visible: function() {
      if (this.innerVisible !== this.visible) {
        this.innerVisible = this.visible
        if (this.visible) {
          this.role = undefined
          this.user = undefined
          this.options = []
        }
      }
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
      await shareLibrary(this.libraryId, this.options.map((item) => item.id), parseInt(this.role))
      Message({
        message: '分享成功',
        type: 'success',
        duration: 5 * 1000
      })
      this.innerVisible = false
    },
    roleOnchange() {
      console.log(this.role)
    }
  }
}
</script>
