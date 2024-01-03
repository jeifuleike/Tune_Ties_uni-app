<script lang="ts" setup>
import TheNavBar from '@/components/TheNavBar.vue'
import { useStore as useMainStore } from '@/store'
import { onShow } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue';
import { user } from "@/types"

const mainStore = useMainStore()
onShow(() => mainStore.setTheme('raw'))

const userInfo = reactive<user>({
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
</script>

<template>
  <page-meta :page-style="mainStore.getPageMetaStyle" />

  <the-nav-bar :title="'我的资料'" :back="true" :filter="false" :bg="true" />
</template>

<style lang="scss">
</style>
