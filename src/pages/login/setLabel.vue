<script setup>
import TheNavBar from '@/components/TheNavBar.vue'
import { changeUserInfo } from "@/common/api/login";
import { onShow } from '@dcloudio/uni-app'
import { ref, computed, reactive } from 'vue';
import { labels } from './data.ts'
import { useStore as useUserStore } from '@/store/user'
onShow(() => {
  getInfo()
})

const label = reactive (labels())
userStore = useUserStore()

async function getInfo () {
  const { userInfo } = userStore
  userInfo.label.forEach(item => {
    updateLabelSelected(item, true)
  });
}

const list = [{ name: '爱听' }, { name: '兴趣' }, { name: '个人特质' }]
const current = ref<number>(0)
function change (e) {
  current.value = e.target.current
}
function changeTab (e) {
  current.value = e.index
}

function tagClick (i) {
  console.log(i, 'i')
  if (tagLabels.value.length > 6 && !i.selected) {
    uni.showToast({
      title: '最多选择六项哦',
      icon: 'none'
    });
    return
  }
  i.selected = !i.selected
}
function reClick(i) {
  updateLabelSelected(i, false)
}

// 通过选择状态过滤数据
const tagLabels = computed(() => {
  return label.flatMap(group =>
    group.filter(label => label.selected).map(label => label.value)
  );
})

// 根据传入的名字改选择状态
function updateLabelSelected (value, isSelected) {
  for (const group of label) {
    const lab = group.find(label => label.value === value);
    if (lab) {
      lab.selected = isSelected;
      break;
    }
  }
}

// 完成按钮样式
const finishClass = {
  position: 'absolute',
  top: '460rpx',
  right: '60rpx',
  width: '120rpx',
  height: '70rpx',
  zIndex: '9999'
}

// 完成按钮
async function finish() {
  const res = await changeUserInfo({ label: tagLabels.value.join(',') })
  if (res.state) {
    uni.showToast({
      title: '修改成功！'
    })
    userStore.setUserInfo({ label: tagLabels.value })
    const curPages = getCurrentPages()
    // 当没有上一页的时候直接返回主页
    if (curPages.length === 1) {
      uni.switchTab({
        url: '../index/home'
      })
    } else {
      uni.navigateBack({ delta: 1 })
    }
  }
}
</script>

<template>
  <the-nav-bar title="添加音乐标签" :back="true" />
  <view class="box">
    <u-button text="完成" :hairline="false" type="success" plain :customStyle="finishClass" @click="finish"/>
    <view class="selectTags">
      <view v-for="i in tagLabels" :key="i" class="tag">
        <u-tag :text="i" size="mini" plain @click="reClick(i)" closable/>
      </view>
    </view>
    <view>
	  	<view>
	  		<u-tabs ref="uTabs" :list="list" :current="current.value" @click="changeTab" :is-scroll="false"/>
	  	</view>
	  	<swiper style="height: 780rpx;" :current="current.value" @change="change">
	  		<swiper-item v-for="(item, index) in label" :key="index">
          <view class="view">
            <view v-for="i in item" :key="i.value" class="tag">
              <u-tag :text="i.value" :type="i.selected? 'warning' : 'primary'" size="mini" plain @click="tagClick(i)"/>
            </view>
          </view>
	  		</swiper-item>
	  	</swiper>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.box{
  width: 100%;
  height: 100%;
  border: 1rpx solid #f4f4f4;
  padding: calc(var(--status-bar-height) + var(--nav-tab-height-custom)) 0 0;
}
.view {
  display: flex;
  flex-wrap: wrap;
}
.tag {
  margin: 10rpx;
}
.selectTags {
  position: relative;
  height: 300rpx;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  overflow-y: auto;
}
.finish {

}
</style>