<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import ThePlayerBottomBar from '@/components/ThePlayerBottomBar.vue'
import { reactive, ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useStore } from '@/store'
import { useStore as useUserStore } from '@/store/user'

const store = useStore()
const userStore = useUserStore()
const data = reactive<any>({
  // 初始化状态
})

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

// 退出登录
function exit() {
  userStore.$reset()
}

// 前往登录
function login() {
  uni.switchTab({ url: './user' })
}

// 前往自定义主页
function toSettingHome() {
  uni.navigateTo({ url: '../customize/home' })
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
      <!-- <view class="setting-list-item">
        <view class="setting-list-item-title">青少年模式</view>
        <switch class="setting-switch-btn" color="#D1403C" />
      </view>
      <view class="setting-list-item" @tap="toSettingHome">
        <view class="setting-list-item-title">自定义主页</view>
      </view> -->
    </view>

    <!-- 退出登录 -->
    <view class="setting-login">
      
    </view>
  </view>
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

  .setting-login {
    width: 100%;
    height: 96rpx;
    padding: 0 32rpx;
    box-sizing: border-box;

    .setting-login-btn,
    .setting-exit-btn {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12rpx;
    }

    .setting-login-btn {
      color: var(--theme-text-title-color);
      background-color: var(--theme-background-color-card);
    }

    .setting-exit-btn {
      color: #fff;
      background-color: var(--theme-color);
    }
  }
}
</style>

