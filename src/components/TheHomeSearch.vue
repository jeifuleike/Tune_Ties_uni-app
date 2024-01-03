<!-- 
    首页搜索
 -->
<script lang="ts" setup>

</script>

<template>
  <!-- 首页搜索 -->
  <view class="search-container">
    <input type="text" placeholder="搜一搜" class="musicInput">
    <img src="../static/search.png" class="search-icon" alt="">
  </view>
</template>

<style lang="scss" scoped>
.search-container {
  margin-top: 10rpx;
  position: relative;
  .musicInput{
    border: 2rpx solid var(--theme-border-color);
    border-radius: 40rpx;
    background-color: var(--theme-search-color);
    padding-left: 60rpx;
    margin-left: 30rpx;
    margin-right: 30rpx;
    font-size: 30rpx;
    color: var(--theme-text-title-color);
  }
  .search-icon {
    position: absolute;
    top: 50%;
    left: 40rpx;
    transform: translateY(-50%);
    /* 这里可以设置图标的样式，比如背景图 */
    width: 40rpx;
    height: 40rpx;
  }
}
</style>