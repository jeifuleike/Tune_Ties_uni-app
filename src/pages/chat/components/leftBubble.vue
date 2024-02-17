<script setup lang="ts">
const props = defineProps<{
  // 信息
  message: string

  // 头像
  avatarUrl: string
}>()
</script>
<template>
  <view class="left-bubble-container">
  	<view class="left">
  	  <image style="background-color: #fff;" :src="props.avatarUrl"></image>
  	</view>
  	<view class="right">
  	  <view class="bubble">
  	  	<text>{{ props.message }}</text>
  	  </view>
  	</view>
  </view>
</template>

<style lang="scss" scoped>
.left-bubble-container {
  margin: 10px 0;
  display: flex;
  .left {
  	image {
  	  height: 30px;
  	  width: 30px;
  	  border-radius: 5px;
  	}
  }
}
.bubble {
  max-width: calc(100vw - 110px);
  min-height: 25px;
  border-radius: 5px;
  background-color: #ffffff;
  position: relative;
  margin-left: 10px;
  padding: 5px 10px;
  text {
  	height: 25px;
  	line-height: 25px;
    word-break: break-all;
    width: 100%;
  }
}
.bubble::before {
  position: absolute;
  top: 10px;
  left: -14px;
  content: "";
  width: 0;
  height: 0;
  border-right: 7px solid #ffffff;
  border-bottom: 7px solid transparent;
  border-left: 7px solid transparent;
  border-top: 7px solid transparent;
}
</style>
