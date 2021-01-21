<template>
  <div class="app-container">
    <el-page-header content="详情页面" />
    <el-table :data="librarys" style="width: 100%">
      <el-table-column label="日期" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="address" label="地址" show-overflow-tooltip />
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLibrarys } from '@/api/library'

export default {
  name: 'Dashboard',
  data() {
    return {
      librarys: []
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
      this.librarys = res.librarys
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
</style>
