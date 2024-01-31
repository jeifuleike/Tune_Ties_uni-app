<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { reactive } from 'vue'
import { useStore as useMainStore } from '@/store'
import { useStore as useUserStore } from '@/store/user'
import { computed } from 'vue'
import { register, login } from "@/common/api/login";

const mainStore = useMainStore()
const userStore = useUserStore()
const data = reactive<any>({
  // 输入内容
  userName: '',

  // 输入密码
  password: '',

  // 确认密码
  confirmPassword: '',

  // 登录或者注册
  type: 'register'

})

interface ResponseData {
  state: number;
  data: any;
  msg: string;
}

onShow(() => {
  mainStore.setTheme('raw')
  if (userStore.token) {
    uni.switchTab({ url: '../index/home' })
  }
})

onLoad((options) => {
  data.type = options.type
})

// 输入账号
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

function changeType() {
  data.type === 'register'? data.type = 'login' : data.type = 'register'
  data.userName = ''
  data.password = ''
  data.confirmPassword = ''
}

async function finish() {
  const obj = { ...data }
  delete obj.confirmPassword
  let res:ResponseData = { data: {}, msg: '', state: 0 }
  if (data.type === 'register') {
    res = await register(obj)
  } else {
    res = await login(obj)
  }
  if (res.state) {
    uni.showToast({
      title: res.msg,
      duration: 2000
    });
    userStore.setUserToken(res.data.token)
    userStore.setUserInfo(res.data.userInfo)
    setTimeout(() => {
      if (data.type === 'register') {
        uni.navigateTo({ url: './profile' })
      }else {
        uni.switchTab({ url: '../index/home' })
      }
    }, 2000)
  } else {
    uni.showToast({
      icon: 'error',
      title: res.msg,
      duration: 2000
    });
  }
}

const btnDisabled = computed(() => {
  if (data.type === 'register') {
    return data.password.length < 3 || !(data.password === data.confirmPassword) || data.userName.length < 3
  } else {
    return data.password.length < 3
  }
})
</script>

<template>
  <page-meta :page-style="mainStore.getPageMetaStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar :title="data.type === 'register'? '注册' : '登录'" :back="true" :filter="false" :bg="true" />

  <view class="login-at-phone">
    <view class="login-at-phone__main">
      <!-- 描述 -->
      <view class="login-at-phone__main-title-h2">
        <text>{{ data.type === 'register'? '注册后体验更多精彩' : '欢迎登录' }}</text>
      </view>

      <!-- 手机号输入框 -->
      <view class="login-at-phone__main-input">
        <input
          :value="data.userName"
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
          :value="data.password"
          @input="inputPassword"
          class="login-at-phone__main-input-content"
          type="password"
          placeholder="输入密码"
          :focus="false"
          :adjust-position="false"
        />
      </view>
      <template v-if="data.type === 'register'">
        <view class="login-at-phone__main-input">
        <input
          :value="data.confirmPassword"
          @input="confirmInputPassword"
          class="login-at-phone__main-input-content"
          type="password"
          placeholder="确认密码"
          :focus="false"
          :adjust-position="false"
        />
        </view>
        <text class="errorT" v-if="!(data.password === data.confirmPassword) && data.confirmPassword">密码不一致！</text>
      </template>
      <text class="changeType" @click="changeType">{{ data.type === 'register'? '前往登录' : '前往注册' }}</text>
      <view class="login-at-phone__main-next">
        <button
        type="warn"
        :disabled="btnDisabled"
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
    .changeType {
      margin-top: 12rpx;
      margin-right: 32rpx;
      color: #72B8FF;
      float: right;
    }
  }
}
</style>