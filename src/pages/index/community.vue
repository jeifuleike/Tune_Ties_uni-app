<script lang="ts" setup>
import ThePlayerBottomBar from '@/components/ThePlayerBottomBar.vue'
import TheNavBar from '@/components/TheNavBar.vue'

import { computed } from 'vue';
import { useStore } from '@/store';
import { useStore as useUserStore } from "@/store/user";
import { useStore as useChatStore } from "@/store/chat"
import contactItem from '@/pages/chat/components/contactItem.vue';
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

const chatStore = useChatStore()
const userStore = useUserStore()
const store = useStore()

// 前往登录
function login() {
  uni.switchTab({ url: './user' })
}

onLoad(() => {
  chatStore.chatSocket.emit('getFriendChatList')
})

chatStore.chatSocket.on('upFriendChatList', upFriendChatList);
const friendChatList = ref<any>([])

function upFriendChatList(res: any) {
  console.log(res, 'res')
  friendChatList.value = res
}

// 前往聊天室
function goToChatRoom(id: number) {
  uni.navigateTo({
    url: '../chat/friendChat?id=' + id
  })
}

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
      <view
        v-for="item in friendChatList"
        @click="goToChatRoom(item.userInfo.userId)"
      >
        <contactItem
          :avatar="item.userInfo.avatar"
          :name="item.userInfo.userName"
          :lastMsg="item.lastMessage.txt"
          :lastTime="item.lastMessage.SendTime"
        />
      </view>

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
