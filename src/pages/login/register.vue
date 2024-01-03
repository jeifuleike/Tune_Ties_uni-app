<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import { onShow } from '@dcloudio/uni-app'
import { reactive } from 'vue'
import { useStore as useMainStore } from '@/store'
import { computed } from 'vue'
import { register } from "@/common/api/login";

const mainStore = useMainStore()
const data = reactive<any>({
  // 输入内容
  userName: '',

  // 输入密码
  password: '',

  // 确认密码
  confirmPassword: ''

})

onShow(() => mainStore.setTheme('raw'))

// 输入手机号
function inputPhone(e: any) {
  data.userName = e.detail.value
}

// 输入密码
function inputPassword(e: any) {
  data.password = e.detail.value
}

// 确认密码
function confirmInputPassword(e: any) {
  data.confirmPassword = e.detail.value
}

async function finish() {
  const obj = { ...data }
  delete data.confirmPassword
  const res = await register(data)
  if (res.state) {
    uni.showToast({
      title: res.msg,
      duration: 2000
    });
    uni.setStorageSync('token', res.data.token)
    uni.navigateTo({
    url: './profile'
  })
  }
}

const able = computed(() => {
  return data.password === data.confirmPassword
})

</script>

<template>
  <page-meta :page-style="mainStore.getPageMetaStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar :title="'注册'" :back="true" :filter="false" :bg="true" />

  <view class="login-at-phone">
    <view class="login-at-phone__main">
      <!-- 描述 -->
      <view class="login-at-phone__main-title-h2">
        <text>注册后体验更多精彩</text>
      </view>

      <!-- 手机号输入框 -->
      <view class="login-at-phone__main-input">
        <input
          @input="inputPhone"
          class="login-at-phone__main-input-content"
          placeholder="输入用户名"
          maxlength="11"
          minlength="2"
          :focus="true"
          :adjust-position="false"
        />
      </view>

      <!-- 密码输入框 -->
      <view class="login-at-phone__main-input">
        <input
          @input="inputPassword"
          class="login-at-phone__main-input-content"
          type="password"
          placeholder="输入密码"
          :focus="false"
          :adjust-position="false"
        />
      </view>

      <view class="login-at-phone__main-input">
        <input
          @input="confirmInputPassword"
          class="login-at-phone__main-input-content"
          type="password"
          placeholder="确认密码"
          :focus="false"
          :adjust-position="false"
        />
      </view>
      <text class="errorT" v-if="!able && data.confirmPassword">密码不一致！</text>
      <!-- 下一步 -->
      <view class="login-at-phone__main-next">
        <button
        type="warn"
        :disabled="data.password.length < 3 || data.password.length < 3 || !able"
        @click="finish"
        >完成</button>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.login-at-phone {
  overflow: hidden;
  width: 100%;
  height: calc(100vh - var(--status-bar-height) - var(--nav-tab-height-custom));
  padding: calc(var(--status-bar-height) + var(--nav-tab-height-custom)) 0 0;

  .login-at-phone__main {
    margin-top: 73rpx;
    width: 100%;
    padding: 0 33rpx;
    box-sizing: border-box;

    .login-at-phone__main-title-h2 {
      font-size: 33.3rpx;
      font-weight: 700;
      color: var(--theme-text-title-color);
      line-height: 1;
    }

    .login-at-phone__main-title-p {
      margin-top: 24.4rpx;
      font-size: 25.64rpx;
      color: var(--theme-text-sub-color);
      line-height: 1;
    }

    // 输入框容器
    .login-at-phone__main-input {
      height: 83.4rpx;
      width: 100%;
      border-bottom: 1px solid var(--theme-border-color);
      display: flex;
      align-items: center;
      margin-top: 16rpx;

      .login-at-phone__main-input-content {
        height: 32rpx;
        width: 100%;
        color: var(--theme-text-title-color) !important;

        .input-placeholder {
          color: var(--theme-text-sub-color);
        }

        .uni-input-input {
          color: var(--theme-text-title-color) !important;
        }
      }
    }

    .login-at-phone__main-next {
      margin-top: 77rpx;
      width: 100%;
      line-height: 80rpx;
      text-align: center;
      opacity: 1;

      .login-at-phone__main-next__pwd,
      .login-at-phone__main-next__code {
        width: 100%;
        height: 80rpx;
        border-radius: 80rpx;
        margin-bottom: 12px;
        color: #000;
        border: 1px solid var(--theme-border-color);
        background-color: #fff;
      }
    }
    .errorT {
      color: red;
    }
  }
}
</style>