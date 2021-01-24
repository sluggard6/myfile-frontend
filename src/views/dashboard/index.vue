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
      <el-table-column prop="address" label="操作" show-overflow-tooltip>
        <template slot-scope="{row}">
          <transition name="el-fade-in">
            <div v-show="row.display">
              <el-tooltip effect="light" placement="top" content="分享" transition="el-fade-in">
                <div class="icon-item">
                  <i class="el-icon-share" @click="{dialogShow=true;title='共享资料库'+row.name}" />
                </div>
              </el-tooltip>
              <el-tooltip effect="light" placement="top" content="删除" transition="el-fade-in">
                <div class="icon-item">
                  <i class="el-icon-delete-solid" />
                </div>
              </el-tooltip>
            </div>
          </transition>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" show-overflow-tooltip />
    </el-table>
    <el-dialog :title="title" :visible.sync="dialogShow">
      <el-tabs tab-position="left" style="margin-bottom: 30px;">
        <el-tab-pane label="共享给用户">
          <el-form>
            <el-input placeholder="请输入内容" />
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="共享给呵呵">共享给呵呵</el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLibrarys } from '@/api/library'

export default {
  name: 'Dashboard',
  data() {
    return {
      librarys: [],
      dialogShow: false,
      title: '共享资料库'
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
      this.librarys = res.data
      this.librarys.forEach(e => {
        // e.active = false
        this.$set(e, 'active', false)
        this.$set(e, 'display', false)
      })
    },
    optionShow(row) {
      row.display = true
    },
    optionHide(row) {
      row.display = false
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
</style>
