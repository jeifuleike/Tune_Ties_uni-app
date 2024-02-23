<script lang="ts" setup>
import ThePlayerBottomBar from '@/components/ThePlayerBottomBar.vue'
import TheNavBar from '@/components/TheNavBar.vue'

import { computed } from 'vue';
import { useStore } from '@/store';
import { useStore as useUserStore } from "@/store/user";
import { Request } from '@/common/apiService';
import contactItem from '@/pages/chat/components/contactItem.vue';

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
      <contactItem
        avatar="http://localhost:4000/public/images/userImage/3-1706624680742.jpeg"
        name="qweq"
        lastMsg="今天好热啊"
        :unReadMsg="2"
        :lastTime="(new Date()).getTime()"
      />
      <contactItem
        avatar="http://localhost:4000/public/images/userImage/defaultUser.png"
        name="wewewe"
        lastMsg="对的"
        :lastTime="(new Date()).getTime() - (10 * 60 * 1000)"
      />
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
