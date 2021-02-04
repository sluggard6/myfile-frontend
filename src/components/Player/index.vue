<template>
  <el-dialog :title="title" :visible.sync="dialogShow">
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
    }
  },
  data() {
    return ({
      config: {
      },
      type: 'TXT'
    })
  },
  method: {
    fileFilter: function(ext) {
      ext = ext.toLowerCase()
      switch (ext) {
        case 'txt': return 'TXT'
        case 'mp4': return 'VIDEO'
        default: {
          return 'DEFAULT'
        }
      }
    }
  }
}
</script>
