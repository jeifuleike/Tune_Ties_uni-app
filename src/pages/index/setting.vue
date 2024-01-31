<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import ThePlayerBottomBar from '@/components/ThePlayerBottomBar.vue'
import { reactive, ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useStore } from '@/store'
import { useStore as useUserStore } from '@/store/user'

const store = useStore()
const userStore = useUserStore()

onShow(() => store.setTheme('raw'))

const pageStyle = computed(() => store.getPageMetaStyle)
const themeDark = computed(() => store.themeConfig.theme === 'dark')
function themeChange(e: any) {
  if (e.detail.value) {
    store.setTheme('dark')
  } else {
    store.setTheme('light')
  }
}

// 前往登录
function login() {
  uni.switchTab({ url: './user' })
}

// 修改个人资料
function profile() {
  uni.navigateTo({ url: '../login/profile' })
}

let show = ref<boolean>(false)

function confirm() {
  show.value = false
  uni.showToast({
    title: '退出登录成功！',
    duration: 2000
  });
  userStore.setUserToken('')
  userStore.setUserInfo({
    userName: '',
    sex: 0,
    avatar: '',
    birthday: new Date(),
    region: '',
    label: [],
    listLike: []
  })
  setTimeout(() => {
    uni.switchTab({ url: '../index/home' })
  }, 2000)
}

</script>

<template>
  <page-meta :page-style="pageStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar title="设置" :back="false" :filter="false" :bg="true" />

  <!-- ↓ 播放器 -->
  <the-player-bottom-bar />

  <view class="setting-wrap fixed-top fixed-bottom">
    <!-- 设置列表 -->
    <view class="setting-list">
      <view class="setting-list-item">
        <view class="setting-list-item-title">夜间模式</view>
        <switch
          class="setting-switch-btn"
          color="#D1403C"
          @change="themeChange"
          :checked="themeDark"
        />
      </view>
      <view class="button" v-if="!userStore.token">
        <u-button type="success" plain @click="login" >
        前往登录
        </u-button>
      </view>
      <template v-else>
        <view class="button">
          <u-button type="primary" plain @click="profile">
            修改个人资料
          </u-button>
        </view>
        <view class="button">
          <u-button type="error" plain @click="show = true">
            退出登录
          </u-button>
        </view>
      </template>
    </view>
  </view>
  <u-modal :show="show" content="确定要退出登录吗？" @cancel="show = false" @confirm="confirm" showCancelButton	></u-modal>
</template>

<style lang="scss" scoped>
.setting-wrap {
  width: 100%;
  min-height: calc(100vh - var(--window-bottom));
  box-sizing: border-box;
  position: relative;

  .setting-list {
    overflow: hidden;
    margin: 32rpx;
    background-color: var(--theme-background-color-card);
    border-radius: 12rpx;
    position: 16rpx;
    .button{
      margin-top: 32rpx;
      padding: 0 16rpx;
    }
    .setting-list-item {
      width: 100%;
      height: 96rpx;
      padding: 0 32rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--theme-text-title-color);

      .setting-switch-btn {
        transform: scale(0.8);
      }
    }
  }
}
</style>

