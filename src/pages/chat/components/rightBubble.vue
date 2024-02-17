<script setup lang="ts">
const props = defineProps<{
  // 信息
  message: string

  // 头像
  avatarUrl: string
}>()
</script>

<template>
  <view class=".right-bubble-container">
  	<view class="right">
  	  <image style="background-color: #fff;" :src="props.avatarUrl"></image>
  	</view>
  	<view class="left">
  	  <view class="bubble">
  	  	<span style="direction: ltr; unicode-bidi: bidi-override">
  	  	  <text>{{ props.message }}</text>
  	  	</span>
  	  </view>
  	</view>
  </view>
</template>

<style lang="scss" scoped>
.right-bubble-container {
  display: flex;
  direction: rtl;
  margin: 10px 0;
  .right {
  	image {
  	  height: 30px;
  	  width: 30px;
  	  border-radius: 5px;
  	}
  }
}
.bubble {
  max-width: calc(100vw - 120px);
  min-height: 25px;
  border-radius: 5px;
  background-color: #95EC6A;
  position: relative;
  margin-right: 10px;
  padding: 5px 10px;
  text-align: left;
  text {
  	height: 20px;
  	line-height: 25px;
    word-break: break-all;
    width: 100%;
  }
}
.bubble::after {
  position: absolute;
  top: 10px;
  right: -14px;
  content: "";
  width: 0;
  height: 0;
  border-right: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 7px solid #95EC6A;
  border-top: 7px solid transparent;
}
</style>