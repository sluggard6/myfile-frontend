<template>
  <div class="app-container">
    <h3>详情页面</h3>
    <el-table :data="librarys" style="width: 100%" highlight-current-row @cell-mouse-enter="optionShow" @cell-mouse-leave="optionHide">
      <el-table-column width="55">
        <template slot-scope="{row}">
          <i :class="row.active?'el-icon-star-on':'el-icon-star-off'" @click="row.active=!row.active" />
        </template>
      </el-table-column>
      <el-table-column label="日期" width="120">
        <template slot-scope="{row,$index}">{{ librarys[$index].active }}{{ row.active }}</template>
      </el-table-column>
      <el-table-column label="名称" width="120">
        <template slot-scope="{row}">
          <router-link :to="'/folder/' + row.rootFolder.id">
            <el-link class="link-type">{{ row.name }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template slot-scope="{row,$index}">
          <transition name="el-fade-in">
            <div v-show="row.display">
              <el-tooltip effect="light" placement="top" content="分享" transition="el-fade-in">
                <div class="icon-item">
                  <i class="el-icon-share" @click="{dialogShow=true;title='共享资料库'+row.name}" />
                </div>
              </el-tooltip>
              <el-tooltip effect="light" placement="top" content="编辑" transition="el-fade-in">
                <div class="icon-item">
                  <i class="el-icon-edit" />
                </div>
              </el-tooltip>
              <el-tooltip effect="light" placement="top" content="删除" transition="el-fade-in">
                <div class="icon-item">
                  <el-popconfirm title="确定删除吗？" @onConfirm="deleteLibrary(row,$index)">
                    <i slot="reference" class="el-icon-delete-solid" />
                  </el-popconfirm>
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
          <el-button type="primary" @click="createLibraryShow=true">新建资料库</el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="title" :visible.sync="dialogShow">
      <el-tabs tab-position="left" style="margin-bottom: 30px;">
        <el-tab-pane label="共享给用户">
          <el-form>
            <el-table>
              <el-table-column label="用户">
                <template slot="header">
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
                </template>
              </el-table-column>
              <el-table-column label="权限">
                <template slot="header">
                  <el-select>
                    <el-option key="read">只读</el-option>
                    <el-option key="write">读写</el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="共享给呵呵">共享给呵呵</el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog :title="editTitle" :visible.sync="createLibraryShow">
      <el-form label-width="120px">
        <el-form-item label="Library Name">
          <el-input v-model="newLibraryName" placeholder="请输入资料库名称" clearable @focus="checkedName=true" @blur="chekcName" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="checkedName" @click="createLibrary">确定</el-button>
          <el-button @click="createLibraryShow=false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLibrarys, checkLibraryName, createLibrary, deleteLibrary } from '@/api/library'
import { queryLike } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'Dashboard',
  data() {
    return {
      librarys: [],
      dialogShow: false,
      title: '共享资料库',
      createLibraryShow: false,
      checkedName: true,
      editTitle: '',
      newLibraryName: '',
      shareNames: [],
      options: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'id'
    ])
  },
  created() {
    this.getLibrarys()
  },
  methods: {
    async getLibrarys() {
      const res = await getLibrarys('mine')
      // this.librarys = res.data
      res.data.forEach(e => {
        e.active = false
        e.display = false
        this.librarys.push(e)
      })
      // this.librarys.forEach(e => {
      //   this.$set(e, 'active', false)
      //   this.$set(e, 'display', false)
      // })
    },
    async querySearch(queryString) {
      this.loading = true
      const res = await queryLike(queryString)
      console.log(res)
      this.loading = false
      this.options = res.data
    },
    handleSelect(item) {
      console.log(item)
    },
    optionShow(row) {
      row.display = true
    },
    optionHide(row) {
      row.display = false
    },
    async chekcName() {
      console.log(this.newLibraryName)
      if (this.newLibraryName === '') { return }
      const res = await checkLibraryName(this.newLibraryName)
      console.log(res)
      this.checkedName = !res.data
      if (this.checkedName) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    async createLibrary() {
      const res = await createLibrary(this.newLibraryName)
      var library = res.data
      library.active = false
      library.display = false
      this.librarys.push(library)
      this.createLibraryShow = false
    },
    async deleteLibrary(row, index) {
      const res = await deleteLibrary(row.id)
      this.librarys.splice(index, 1)
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
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
.el-button-row {
  display: flex;
  justify-content: flex-end;
  padding: 5px;
}
</style>
