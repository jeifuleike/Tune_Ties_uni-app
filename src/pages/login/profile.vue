<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import { useStore as useMainStore } from '@/store'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue';
import { user } from "@/types"
import { getUserInfo, changeUserInfo } from "@/common/api/login";
import { computed } from 'vue';
import { useStore as useUserStore } from "@/store/user";
import day from 'dayjs';
import { reactive } from 'vue';
import { province, urban } from "./city.ts"

const mainStore = useMainStore()
const userStore = useUserStore()
onShow(() => {
  getInfo()
  mainStore.setTheme('raw')
})

const userInfo = ref<user>({
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

const finishData = ref<user>({
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

// 切换地区
const regionShow = ref<boolean>(false)
const regionColumns = reactive([
  province,
  urban[0]
])

function getInfo() {
  getUserInfo().then(res => {
    userInfo.value = res.data
    finishData.value = JSON.parse(JSON.stringify(res.data))
  })
}

const birthday = computed(() => {
  return day(userInfo.value.birthday).format('YYYY-M-D')
})

// 上传头像
const afterRead = (event: any) => {
  uni.uploadFile({
    url: 'http://localhost:4000/express/api/upImage/user/uploadAvatar',
    header: {
      Authorization: `Bearer ${userStore.token}`
    },
    filePath: event.file.url,
    name: 'avatar',
    success: (uploadFileRes) => {
      // 处理上传成功的响应
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

// 统一修改
async function changeUser (key: keyof user, value?:any) {
  if (value !== undefined) {
    console.log(value, 'value')
    await changeUserInfo({ [key]: value })
  } else {
    await changeUserInfo({ [key]: finishData.value[key] })
  }
  getInfo()
}

// 控制修改用户名的弹窗的显示
const changeNameShow = ref<boolean>(false)

function finishChangeName() {
  if (finishData.value.userName.length < 2) {
    uni.showToast({
      icon: 'error',
      title: '请输入内容大于2',
      duration: 2000
    });
  } else {
    changeNameShow.value = false
    changeUser('userName')
  }
}

// 切换性别
const sexShow = ref<boolean>(false)
function finishChangeSex(e: any) {
  let sex = 0
  if(e.value[0] === '男') sex = 1
  changeUser('sex', sex)
  sexShow.value = false
}

// 切换日期
const birthdayShow = ref<boolean>(false)
function finishBirthday(e: any) {
  changeUser('birthday', e.value)
  birthdayShow.value = false
}

const changeHandler = (e: any) => {
  const {
    columnIndex,
    index
  } = e;
  if (columnIndex === 0) {
    regionColumns[1] = urban[index]
  }
};

function finishRegionShow (e:any) {
  changeUser('region', e.value.join(' '))
  regionShow.value = false
}
</script>

<template>
  <page-meta :page-style="mainStore.getPageMetaStyle" />

  <the-nav-bar :title="'我的资料'" :back="true" :filter="false" :bg="true"/>
  <view class="main">
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
      <u-cell @click="changeNameShow = true" :border="false" isLink :value="userInfo.userName">
        <template #title>
    		  <text class="u-cell-text">昵称</text>
    	  </template>
      </u-cell>
      <u-cell @click="sexShow = true"  :border="false" isLink :value="userInfo.sex? '男' : '女'">
        <template #title>
    		  <text class="u-cell-text">性别</text>
    	  </template>
      </u-cell>
      <u-cell @click="birthdayShow = true" :border="false" isLink :value="birthday">
        <template #title>
    		  <text class="u-cell-text">生日</text>
    	  </template>
      </u-cell>
      <u-cell @click="regionShow = true" :border="false" isLink>
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
    <u-popup closeable :show="changeNameShow" :round="10" mode="bottom" @close="changeNameShow = false">
		  <view class="changeUserName">
        <input
          class="nameInput"
          placeholder="请输入用户名"
          v-model="finishData.userName"
          :maxlength="10"
          focus
        />
        <u-button type="success" shape="circle" @click="finishChangeName">确定</u-button>
		  </view>
	  </u-popup>
    <u-picker 
      closeOnClickOverlay 
      :show="sexShow" 
      @confirm="finishChangeSex" 
      @close="sexShow = false" 
      @cancel="sexShow = false"
      :columns="columns"
    ></u-picker>
    <u-picker 
      closeOnClickOverlay 
      :show="sexShow" 
      @confirm="finishChangeSex" 
      @close="sexShow = false" 
      @cancel="sexShow = false"
      :columns="[['男', '女']]"
    ></u-picker>
    <u-datetime-picker
      :show="birthdayShow"
      v-model="finishData.birthday"
      mode="date"
      :maxDate="new Date()"
      :minDate="day().subtract(100, 'year').valueOf()"
      @close="birthdayShow = false"
      @confirm="finishBirthday"
      @cancel="birthdayShow = false"
    ></u-datetime-picker>
    <u-picker 
      closeOnClickOverlay 
      :show="regionShow" 
      @confirm="finishRegionShow" 
      @close="regionShow = false" 
      @cancel="regionShow = false"
      :columns="regionColumns"
      @change="changeHandler"
    ></u-picker>
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
.changeUserName {
  height: 300rpx;
  margin-top: 80rpx;
  padding: 60rpx;
  .nameInput{
    border: 1px solid var(--theme-border-color);
    border-radius: 30rpx;
    padding-left: 30rpx;
    height: 80rpx;
    line-height: 80rpx;
    margin-bottom: 60rpx;
  }
}
</style>
