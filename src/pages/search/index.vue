<script lang="ts" setup>
import ListSongs from '@/components/ListSongs.vue'
import TheNavBar from '@/components/TheNavBar.vue'
import { get } from '@/common/apiService'
import API from '@/common/api'
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const searchVal = ref('')
const suggestList = ref<any>([])
const searchOver = ref(false)

onLoad(() => {
  if (historyList.value.length === 0) {
    console.log(uni.getStorageSync('history'), 'uni.getStorageSync')
    historyList.value = uni.getStorageSync('history')? uni.getStorageSync('history').split(',') : []
    console.log(historyList.value, 'res.result.songs')
  }
})

// 获取搜索联想
async function searchSuggest () {
  if (searchVal.value.length !== 0) {
    const res = await get(API.SEARCH.GET_SEARCH_SUGGEST, { keywords: searchVal.value })
    if (res.result.songs) {
      suggestList.value = res.result.songs
    } else {
      suggestList.value = []
    }
  } else {
    suggestList.value = []
  }
}

// 点击搜索联想或者历史记录
function suggestClick (value) {
  searchOver.value = true
  searchVal.value = value
  search()
}

const historyList = ref<string[]>([])

function addHistoryItem () {
  // 历史记录不保存重复搜索
  const existingIndex = historyList.value.findIndex(item => item === searchVal.value);

  if (existingIndex !== -1) {
    historyList.value.splice(existingIndex, 1);
  }
  historyList.value.unshift(searchVal.value);
  
  // 历史记录最多存储15个
  if (historyList.value.length > 15) {
    historyList.value.pop();
  }
  uni.setStorageSync('history', historyList.value.join(','))
}

async function search () {
  if (!searchVal.value) return

  addHistoryItem()
  searchOver.value = true
  const res = await get(API.SEARCH.GET_SEARCH, { keywords: searchVal.value })
  suggestList.value = res.result.songs
}

const emptyHistoryShow = ref(false)

function emptyHistory () {
  historyList.value = []
  emptyHistoryShow.value = false
}
</script>

<template>
  <the-nav-bar :title="'搜索'" :back="true" :filter="true" :bg="true" />
  <view class="main">
    <view class="search-container">
      <view style="width: 100%;">
        <input @focus="searchOver = false" @input="searchSuggest" v-model="searchVal" type="text" placeholder="搜一搜" class="musicInput">
        <img src="../static/search.png" class="search-icon" alt="">
      </view>
      <button class="searchBtn" @click="search">搜索</button>
    </view>
    <view class="suggestView" v-if="searchVal.length > 0 && !searchOver">
      <view class="suggestItem" v-for="item in suggestList" :key="item.id" @click="suggestClick(item.name)">
          <img src="../static/search.png" class="suggest-icon" alt="">
        {{ item.name }}
      </view>
      <view 
        v-if="suggestList.length === 0" 
        @click="search"
        style="margin: 40rpx 0 0 30rpx; color: #647C9E; display: inline-block;"
       >
        搜索“{{ searchVal }}”
    </view>
    </view>
    <view style="height: 100%; padding: 0 30rpx;" v-else>
      <view v-if="!searchOver">
        <view class="historyTop">
          <span class="topLeft">搜索历史</span>
          <span class="topRight" @click="emptyHistoryShow = true">清空搜索历史</span>
        </view>
        <view class="historyList">
          <view 
            class="historyItem" 
            v-for="(item, index) in historyList"
            :key="index"
            @click="suggestClick(item)"
          >
            {{ item.length > 6 ? item.substring(0,6) + '...' : item }}
          </view>
        </view>
      </view>
      <view v-else>
        <ListSongs :trackIds="suggestList.map(item => item.id)" :infinite="false" actionBg="#fff"/>
      </view>
    </view>
  </view>
  <u-modal
    :showCancelButton = true
    :show="emptyHistoryShow"
    content='你确定要清空历史记录吗'
    @confirm="emptyHistory"
    @cancel="emptyHistoryShow = false"
  />
</template>

<style lang="scss" scoped>
.main {
  padding-top: 56px;
  height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  .search-container {
    margin-top: 30rpx;
    position: relative;
    display: flex;
    .musicInput{
      border: 2rpx solid #E7E7E7;
      border-radius: 40rpx;
      background-color: #F8F9FA;
      padding-left: 90rpx;
      margin-left: 30rpx;
      font-size: 30rpx;
      height: 25px;
      color: #333333;
    }
    .search-icon {
      position: absolute;
      top: 50%;
      left: 60rpx;
      transform: translateY(-50%);
      /* 这里可以设置图标的样式，比如背景图 */
      width: 40rpx;
      height: 40rpx;
    }
  }
  .suggestView {
    height: 100%;
      .suggestItem {
        display: flex;
        align-items: center;
        height: 100rpx;
        font-size: 14px;
        border-bottom: 1px solid #F2F3F7;
      }
      .suggest-icon {
        height: 40rpx;
        width: 40rpx;
        margin: 0 30rpx;
      }
    }
  .searchBtn {
    background-color: #fff;
    height: 27px;
    font-size: 34rpx;
    line-height: 27px;
    margin: 0;
    padding: 0;
    width: 60px;
  }
  .searchBtn::after {
    border: none;
  }
  .historyTop {
    height: 50px;
    line-height: 50px;
    .topLeft {
      font-size: 16px;
    }
    .topRight {
      font-size: 12px;
      float: right;
      margin-right: 20rpx;
      color: red;
    }
  }
  .historyList {
    display: flex;
    flex-wrap: wrap;
    .historyItem {
      background-color: #F8F9FD;
      display: initial;
      padding: 6px;
      border-radius: 13px;
      font-size: 12px;
      margin-left: 20rpx;
      margin-bottom: 30rpx;
    }
  }

}

</style>