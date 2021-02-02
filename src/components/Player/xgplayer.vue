<template>
  <el-dialog :title="title" :visible.sync="dialogShow">
    <Xgplayer :config="config" @player="Player = $event" />
  </el-dialog>
</template>
<script>
import Xgplayer from 'xgplayer-vue'
export default {
  components: {
    Xgplayer
  },
  data() {
    return ({
      config: {
      }
    })
  }
}
</script>
