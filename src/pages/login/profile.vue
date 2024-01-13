<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import { useStore as useMainStore } from '@/store'
import { onShow } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue';
import { user } from "@/types"
import { getUserInfo } from "@/common/api/login";
import { computed } from 'vue';
import { useStore as useUserStore } from "@/store/user";
import day from 'dayjs';

const mainStore = useMainStore()
const userStore = useUserStore()
onShow(() => {
  getInfo()
  mainStore.setTheme('raw')
})

let userInfo = reactive<user>({
  // 用户名
  userName: '',
  // 性别
  sex: 0,
  // 头像
  avatar: '',
  // 生日
  birthday: new Date(),
  // 地区
  region: '',
  // 标签
  label: []
})

let loading = ref(false)

function getInfo() {
  getUserInfo().then(res => {
    userInfo = res.data
    loading.value = true
    console.log(userInfo.avatar)
  })
}

const birthday = computed(() => {
  return day(userInfo.birthday).format('YYYY-M-D')
})

// 上传头像
function afterRead(event: any) {
  console.log(event)
  uni.uploadFile({
    url: 'http://localhost:4000/express/api/upImage/user/uploadAvatar',
    header: {
      Authorization: `Bearer ${userStore.token}`
    },
    filePath: event.file.url,
    name: 'avatar',
    success: (uploadFileRes) => {
      // 处理上传成功的响应
      console.log(uploadFileRes);
      const res = JSON.parse(uploadFileRes.data)
      if (res.state) {
        uni.showToast({
          title: res.msg,
          duration: 2000
        });
        getInfo()
      }
    },
    fail: (error) => {
      // 处理上传失败的情况
      console.error(error);
    }
  })
}

const jpg = 'http://localhost:4000/public/images/userImage/1-1705167008980.jpeg'
</script>

<template>
  <page-meta :page-style="mainStore.getPageMetaStyle" />

  <the-nav-bar :title="'我的资料'" :back="true" :filter="false" :bg="true"/>
  <view class="main" v-if="loading">
    <view class="avatar">
      <u-avatar :src="userInfo.avatar" :size="120"></u-avatar>
      <u-upload
	  	  name="1"
	  	  :maxCount="1"
        uploadText="更换"
        @afterRead="afterRead"
        imageMode="center"
	    ></u-upload>
    </view>
    <view>
      <u-cell :border="false" isLink :value="userInfo.userName">
        <template #title>
    		  <text class="u-cell-text">昵称</text>
    	  </template>
      </u-cell>
      <u-cell :border="false" isLink :value="userInfo.sex? '男' : '女'">
        <template #title>
    		  <text class="u-cell-text">性别</text>
    	  </template>
      </u-cell>
      <u-cell :border="false" isLink :value="birthday">
        <template #title>
    		  <text class="u-cell-text">生日</text>
    	  </template>
      </u-cell>
      <u-cell :border="false" isLink>
        <template #title>
    		  <text class="u-cell-text">地区</text>
        </template>
        <template #value>
    		  <text class="u-cell-text" v-if="!userInfo.region">请选择</text>
          <text v-else>{{ userInfo.region }}</text>
        </template>
      </u-cell>
      <u-cell :border="false" isLink>
        <template #title>
    		  <text class="u-cell-text">标签</text>
    	  </template>
        <template #value>
          <text class="u-cell-text" v-if="!userInfo.label.length">请添加</text>
          <text v-else>{{ userInfo.region }}</text>
    	  </template>
      </u-cell>
    </view>
  </view>
</template>

<style lang="scss">
.main {
  overflow: hidden;
  width: 100%;
  height: calc(100vh - var(--status-bar-height) - var(--nav-tab-height-custom));
  padding: calc(var(--status-bar-height) + var(--nav-tab-height-custom)) 0 0;
  background-color: var(--theme-background-color-card);
  .avatar {
    height: 250rpx;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .u-cell-text {
    font-size: 32rpx;
    color: var(--theme-text-sub-color);
  }
}
.u-icon__icon {
  font-size: 12px !important;
}
.u-upload {
  display: inline;
  position: absolute;
  .u-upload__button {
    width: 120rpx !important;
    height: 50rpx !important;
    border-radius: 25rpx !important;
    flex-direction: row !important;
    transform: translate(12rpx, 76rpx);
  }
}
</style>
