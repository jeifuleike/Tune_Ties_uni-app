<!--
Description: 通讯录
-->
<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import { computed, ref } from 'vue';
import { useStore } from '@/store';
import { useStore as useUserStore } from "@/store/user";
import contactItem from '@/pages/chat/components/contactItem.vue';
import { getReqs, getContents } from "@/common/api/chat";
import { onLoad, onPullDownRefresh, onUnload } from '@dcloudio/uni-app';
import { user } from '@/types';

const store = useStore()
const userStore = useUserStore()

const pageStyle = computed(() => store.getPageMetaStyle)

onLoad(() => {
  if (userStore.token) {
    getContacts()
    getReq()
  }
})

console.log(userStore.token, 'userStore.token')
onPullDownRefresh( async() => {
  if (userStore.token) {
    getContacts()
    getReq()
  }
})

// 前往登录
function login() {
  uni.switchTab({ url: './user' })
}

type reqInfo = {
  TargetUserInfo: user,
  userInfo: user,
  requestStatus: 'Pending' | 'Approved' | 'Rejected',
  requestTimestamp: Date
}

const reqData = ref<reqInfo[]>([])
async function getReq() {
  const res = await getReqs()
  reqData.value = res.data.reqInfo
}

function getUserInfo(data:reqInfo): {data: user, type: 'TargetUser' | 'user' } {
  console.log(data,userStore.userInfo )
  if (data.TargetUserInfo.userId !== userStore.userInfo.userId) {
    return { data: data.TargetUserInfo, type: 'user' }
  } else{
    return { data: data.userInfo, type: 'TargetUser' }
  }
}

function getContactInfo(data:any): { data: user } {
  if (data.user1.userId !== userStore.userInfo.userId) {
    return { data: data.user1 }
  } else {
    return { data: data.user2 }
  }
}

const contacts = ref([])
async function getContacts() {
  const { data } = await getContents()
  contacts.value = data
}

// 前往聊天室
function goToChatRoom(id: number) {
  uni.navigateTo({
    url: '../chat/friendChat?id=' + id
  })
}
</script>

<template>
  <page-meta :page-style="pageStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar title="通讯录" :back="false" :filter="false" :bg="true" />
  <view class="main">
    <scroll-view v-if="userStore.token">
      <view class="tab">新朋友</view>
      <contactItem
        v-for="item in reqData"
        :id="getUserInfo(item).data.userId"
        :avatar="getUserInfo(item).data.avatar"
        :name="getUserInfo(item).data.userName"
        :state="{ type:item.requestStatus, user: getUserInfo(item).type }"
        @reqData="getContacts"
      />
      <View class="tab">联系人</View>

      <view
        v-for="item in contacts"
        @click="goToChatRoom(getContactInfo(item).data.userId)"
      >
        <contactItem
          :avatar="getContactInfo(item).data.avatar"
          :name="getContactInfo(item).data.userName"
        />
      </view>
    </scroll-view>
    <view class="toLogin" v-else>
      <image src="../../static/toLogin.png"/>
      使用该功能前需要先登录哦
      <u-button type="success" plain @click="login" >
        前往登录
      </u-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.main {
  height: calc(100vh - 56px);
  margin-top: 56px;
  background-color: #fff;
}
.toLogin {
  padding: 15px;
  height: 100%;
  text-align: center;
  image {
    width: calc(100vw - 30px);
  }
}
.tab {
  height: 30px;
  font-size: 15px;
  line-height: 30px;
  padding: 7px;
  background-color: #E9E7E6;
}
</style>
