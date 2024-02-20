<script lang="ts" setup>
import ThePlayerBottomBar from '@/components/ThePlayerBottomBar.vue'
import TheNavBar from '@/components/TheNavBar.vue'

import { computed } from 'vue';
import { useStore } from '@/store';
import { useStore as useUserStore } from "@/store/user";

const userStore = useUserStore()

// 前往登录
function login() {
  uni.switchTab({ url: './user' })
}
const store = useStore()

const pageStyle = computed(() => store.getPageMetaStyle)
</script>

<template>
  <page-meta :page-style="pageStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar title="聊天" :back="false" :filter="false" :bg="true" />

  <!-- ↓ 播放器 -->
  <the-player-bottom-bar />
  <view style="height: 100vh; margin-top: 56px; background-color: #fff;">
    <scroll-view v-if="userStore.token">
      <!-- <contactItem/> -->
    </scroll-view>
    <view class="toLogin" v-else>
      <image src="../../static/toLogin.png"/>
      使用该功能前需要先登录哦
      <u-button type="success" plain @click="login" >
        前往登录
      </u-button>
    </view>
  </view>
  <view style="margin-top: 56px;">
  </view>
</template>

<style lang="scss" scoped>
</style>
