<template>
  <div class="app-container">
    <h3>Librarys</h3>
    <el-table :data="librarys" style="width: 100%" highlight-current-row @cell-mouse-enter="optionShow" @cell-mouse-leave="optionHide">
      <el-table-column width="55">
        <template slot-scope="{row}">
          <i :class="row.active?'el-icon-star-on':'el-icon-star-off'" @click="row.active=!row.active" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="日期" width="120">
        <template slot-scope="{row,$index}">{{ librarys[$index].active }}{{ row.active }}</template>
      </el-table-column> -->
      <el-table-column label="名称" width="120">
        <template slot-scope="{row}">
          <router-link :to="'/folder/' + row.library.rootFolder.id">
            <el-link class="link-type">{{ row.library.name }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="分享者" width="120">
        <template slot-scope="{row}">{{ row.library.owner.username }}</template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip>
        <template slot-scope="{row,$index}">
          <transition name="el-fade-in">
            <div v-show="row.display">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLibrarys, checkLibraryName, createLibrary, editLibrary, removeShare } from '@/api/library'
import { queryLike } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'Librarys',
  components: {
  },
  data() {
    return {
      type: this.$route.path.split('/')[2],
      librarys: [],
      dialogShow: false,
      title: '共享资料库',
      libraryEditDialog: false,
      checkedName: true,
      editTitle: '',
      libraryName: '',
      libraryId: 0,
      currentRow: null,
      shareNames: [],
      options: [],
      loading: false,
      isCreateLibrary: false
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
      const res = await getLibrarys(this.type)
      this.librarys = []
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
      if (this.libraryName === '') { return }
      const res = await checkLibraryName(this.libraryName)
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
      await createLibrary(this.libraryName)
      this.getLibrarys()
      this.libraryEditDialog = false
    },
    async editLibrary() {
      await editLibrary(this.currentRow.id, this.libraryName)
      this.getLibrarys()
      this.libraryEditDialog = false
    },
    async deleteLibrary(row, index) {
      const res = await removeShare(row.id, row.userId)
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
