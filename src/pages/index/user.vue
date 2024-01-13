<!--
Description: 用户主页
-->
<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import ThePopupLogin from '@/components/ThePopupLogin.vue'
import ThePlayerBottomBar from '@/components/ThePlayerBottomBar.vue'
import sectionFrame from '@/components/section/SectionFrame.vue'
import { onShow, onReady, onLoad } from '@dcloudio/uni-app'
import { reactive, ref, computed } from 'vue'
import { useStore } from '@/store'
import { getUserInfo } from "@/common/api/login";
import { useStore as useUserStore } from "@/store/user";
import { user } from "@/types"
import dayjs from 'dayjs'

const store = useStore()
const userStore = useUserStore()
const navShow = ref<boolean>()
const userWrapRef = ref<any>()

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
  label: [],
  // 收藏的歌单id
  listLike: []
})

const data = reactive<any>({
  // 初始化状态
  init: false,

  // 用户信息
  user: {},

})

onShow(async() => {
  store.setTheme('raw', {
    navigationBarColor: '#ffffff'
  })
  await init()
  data.init = true
})
onLoad(() => {
  console.log('load')
})

// 初始化
async function init() {
  if (userStore.token) {
    try {
      const { data } = await getUserInfo()
      userInfo = data
      userInfo.label.push('+')
    } catch (err) {
      console.log(err)
    }

  } else {
    userInfo = {
      userName: '',
      sex: 0,
      avatar: '',
      birthday: new Date(),
      region: '',
      label: [],
      listLike: []
    }
  }
}

function openPopup() {
  if (!userStore.token) {
    uni.$emit('popupOpen', [{ name: '注册' }, { name: '登录' }])
  }
}

const userInfoTxt = computed(() => {
  const currentDate = dayjs();

  // 出生日期的 dayjs 对象
  const birthDate = dayjs(userInfo.birthday);

  // 计算年龄
  const age = currentDate.diff(birthDate, 'year');

  return (userInfo.sex? '男' : '女') + 
  ' | ' + age + '岁' + 
  (userInfo.region.length? '|' + userInfo.region : '')
})

const pageStyle = computed(() => store.getPageMetaStyle)
</script>

<template>
  <page-meta :page-style="pageStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar
    :title="navShow ? data.user.name : ''"
    :back="false"
    :filter="false"
    :bg="(navShow as boolean)"
  />

  <the-popup-login />

  <!-- ↓ 播放器 -->
  <the-player-bottom-bar />

  <view class="user-wrap fixed-top fixed-bottom" ref="userWrapRef" v-if="data.init">

    <view class="user-main">
      <!-- ↓ 用户信息 -->
      <view @tap="openPopup" class="user-main-info">
        <!-- 头像 -->
        <image
          :src="!userInfo.avatar? '../../static/user.png' : userInfo.avatar"
          class="user-main-info__user-avatar user-avatar-not-register"
          mode="aspectFit"
        />
        <!-- 名 -->
        <view class="user-main-info__user-name">
          {{ !userInfo.userName? '点击登录' : userInfo.userName }}
        </view>
        <!-- 描述 -->
        <view class="user-main-info__user-sub" v-if="!userInfo.userName">
          <template> 登录体验更多精彩 </template>
        </view>
        <view class="user-main-info__user-sub" v-else>
          <template> {{ userInfoTxt }} </template>
        </view>
        <view class="user-main-info__labels">
          <view v-for="(item, key) in userInfo.label" :key="key" style="margin-left: 12rpx;">
            <u-tag :text="item" size="mini" plain shape="circle"/>
          </view>
        </view>
      </view>
          <!-- ↓ 收藏的歌单 -->
      <view class="user-main__playlist-wrap" v-if="userInfo.userName">
        <view class="user-main__playlist-wrap-spacing">
          <section-frame
            :title="`收藏的歌单 (${userInfo.listLike? userInfo.listLike.length : 0}个)`"
            :more="false"
          >
          <!-- TODO收藏列表 -->
            <template #default >
              <view class="user-main__playlist-spacing" v-if="userInfo.listLike?.length">
                <!-- <view
                  @tap.stop.prevent="toPlaylist(item)"
                  class="user-main__playlist"
                  v-for="item in data.UserPlaylist.listLike"
                  :key="item.payload"
                >
                  <image
                    class="user-main__playlist-image"
                    :src="`${item.picUrl}?param=100y100`"
                    mode="aspectFit"
                  />
                  <view class="user-main__playlist-desc text-ellipsis-single">
                    <view class="user-main__playlist-title text-ellipsis-single">{{
                      item.title
                    }}</view>
                    <view class="user-main__playlist-sub text-ellipsis-single">
                      {{ item.trackCount }} 首，播放 {{ convertCount(item.playCount) }} 次
                    </view>
                  </view>
                </view> -->
              </view>
              <view v-else class="user-main__playlist-spacing-empty">快去收藏吧</view>
            </template>
          </section-frame>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.user-wrap {
  width: 100%;
  min-height: calc(100vh - var(--window-bottom));
  box-sizing: border-box;
  background: linear-gradient(
    to bottom,
    var(--theme-background-color),
    var(--theme-background-color)
  );
  position: relative;

  .user-wrap-bg {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(136.5rpx / 2 + 61.4rpx + var(--status-bar-height) + var(--nav-tab-height-custom));
    clip-path: ellipse(220% 100% at 50% 0);
    filter: brightness(50%);
  }

  .user-main {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    margin-top: calc(136.5rpx / 2 + 30.7rpx);
    box-sizing: border-box;
    padding: 0 30.7rpx;

    // 用户信息
    .user-main-info {
      width: 100%;
      background-color: var(--theme-background-color-card);
      border-radius: 28.85rpx;
      position: relative;
      box-sizing: border-box;
      padding-top: calc(136.5rpx / 2);
      padding-bottom: 38.5rpx;

      //  头像
      .user-avatar-not-register {
        background-color: var(--theme-background-color-card);
        border-radius: 50%;
      }
      .user-main-info__user-avatar {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 136.5rpx;
        width: 136.5rpx;
        border-radius: 50%;
      }

      //   名字
      .user-main-info__user-name {
        width: 100%;
        height: 82.7rpx;
        font-size: 36.5rpx;
        line-height: 82.7rpx;
        font-weight: 600;
        text-align: center;
        color: var(--theme-text-title-color);
      }

      // 描述
      .user-main-info__user-sub {
        font-size: 32rpx;
        color: var(--theme-text-sub-color);
        margin-bottom: 20rpx;
        text-align: center;
      }
      
      .user-main-info__labels {
        display: flex;
        justify-content: center;
      }
    }
        // 歌单
        .user-main__playlist-wrap {
      width: 100%;
      box-sizing: border-box;
      margin-top: 30.7rpx;
      .user-main__playlist-wrap-spacing {
        padding: 0 30rpx;
        box-sizing: border-box;
        border-radius: 33rpx;
        background-color: var(--theme-background-color-card);

        // 为空
        .user-main__playlist-spacing-empty {
          padding: 48rpx 0;
          color: var(--theme-text-sub-color);
          text-align: center;
        }

        //  歌单列表容器 s
        .user-main__playlist-spacing {
          margin-top: 20rpx;
          // 歌单列表
          .user-main__playlist {
            display: flex;
            align-items: center;
            margin: 16rpx 0 0;
            .user-main__playlist-image {
              width: 96.15rpx;
              height: 96.15rpx;
              border-radius: 12rpx;
              flex-shrink: 0;
            }

            .user-main__playlist-desc {
              width: calc(100% - 96.15rpx);
              height: 100%;
              padding-left: 18rpx;
              line-height: 1.6;
              .user-main__playlist-title {
                font-size: 30.7rpx;
                width: 100%;
                color: var(--theme-text-title-color);
              }
              .user-main__playlist-sub {
                font-size: 23rpx;
                width: 100%;
                color: var(--theme-text-sub-color);
              }
            }
          }
        }
        // 歌单列表容器 e
      }
    }
  }
}
</style>
