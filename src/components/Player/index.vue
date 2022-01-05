<template>
  <el-dialog :title="title" :visible.sync="dialogShow" :before-close="hidePanel">
    <el-image v-if="type==='IMG'" :src="url">
      <div slot="placeholder" class="image-slot">
        加载中<span class="dot">...</span>
      </div>
    </el-image>
    <xgplayer v-if="type==='VIDEO'" :config.sync="config" @player="Player = $event" />
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
        id: '',
        url: ''
      }
    })
  },
  watch: {
    type: function(newData, oldData) {
      console.log(newData) // newData就是orderData
      // this.newOrderData = newData
      // methods的函数在这里调用可以获取到newOrderData的值
      // this.order()
      // if (newData === 'VIDEO') {
      //   this.config = {
      //     id: this.props.title,
      //     url: this.props.url
      //   }
      // }
      console.log(this.config)
    },
    url: function(newData, oldData) {
      this.config.id = 'vs'
      this.config.url = newData
    }
  },
  mounted: function() {
  },
  beforeUpdate() {
  },
  methods: {
    hidePanel() {
      this.$emit('update:dialogShow', false)
    }
  }
}
</script>
