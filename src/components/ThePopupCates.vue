

<script lang="ts" setup>
import ThePopupFrame from './ThePopupFrame.vue'

function toCate(data: any) {
  uni.$emit('selectCate', data)
}

function close() {
  uni.$emit('popupClose')
}
</script>

<template>
  <the-popup-frame>
    <template #default="{ popupData }">
      <view class="the-popup-container-title">
        <view class="the-popup-container-back" @tap.stop.prevent="close" />
      </view>

      <scroll-view class="the-popup-container-scroll" :scroll-y="true">
        <section-frame
          v-for="(cateName, cateIdx) in popupData.categories"
          :key="cateName"
          :title="cateName"
          :more="false"
        >
          <template #default>
            <view class="cate-list">
              <view
                @tap.stop.prevent="toCate(item)"
                class="cate-item"
                v-for="(item, idx) in popupData.list[cateIdx]"
                :key="`cate-${cateIdx}-${idx}`"
              >
                <view v-if="item.hot" class="cate-item-fire" />
                {{ item.title }}
              </view>
              <view class="fixed-placeholder"></view>
            </view>
          </template>
        </section-frame>
      </scroll-view>
    </template>
  </the-popup-frame>
</template>

<style lang="scss" scoped>
.the-popup-container-title {
  width: 100%;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-shrink: 0;

  .the-popup-container-back {
    height: 72rpx;
    width: 72rpx;
    flex-shrink: 0;
    margin-left: 20.5rpx;
    background-color: black;
    mask-size: 40rpx auto;
    mask-repeat: no-repeat;
    mask-image: url('@/static/icon-arrow-bottom.png');
    mask-position: center;
  }
}

.the-popup-container-scroll {
  width: 100%;
  height: 1004rpx;
}

.cate-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .cate-item {
    width: calc(25% - 30rpx);
    height: 73rpx;
    flex-shrink: 1;
    border-radius: 37rpx;
    color: var(--theme-text-title-color);
    background-color: var(--theme-background-color-clear);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16rpx 15rpx;
    font-size: 20.7rpx;

    .cate-item-fire {
      height: 73rpx;
      width: 26rpx;
      margin-right: 8rpx;
      background-color: #f9343d;
      mask-image: url('@/static/fire.png');
      mask-position: center 55%;
      mask-repeat: no-repeat;
      mask-size: 100% auto;
    }
  }
}
</style>
