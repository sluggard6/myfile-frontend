<template>
  <el-dialog :title="title" :visible.sync="dialogShow" :before-close="hidePanel">
    <el-image v-if="type==='IMG'" :src="url">
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
  methods: {
    hidePanel() {
      this.$emit('update:dialogShow', false)
    }
  }
}
</script>
