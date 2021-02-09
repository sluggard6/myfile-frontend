<template>
  <el-dialog :title="title" :visible.sync="dialogShow">
    <el-image v-if="type==='IMG'" :src="src">
      <div slot="placeholder" class="image-slot">
        加载中<span class="dot">...</span>
      </div>
    </el-image>
    <xgplayer :config="config" @player="Player = $event" />
  </el-dialog>
</template>
<script>
import Xgplayer from 'xgplayer-vue'
export default {
  name: 'FilePlayer',
  components: {
    Xgplayer
  },
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'DEFAULT'
    }
  },
  data() {
    return ({
      config: {
      }
    })
  },
  method: {
  }
}
</script>
