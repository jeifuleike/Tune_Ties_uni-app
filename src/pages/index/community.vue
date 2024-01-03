<!--
Description: 社区
-->
<script lang="ts" setup>
import ThePlayerBottomBar from '@/components/ThePlayerBottomBar.vue'
import TheNavBar from '@/components/TheNavBar.vue'

import { computed } from 'vue';
import { useStore } from '@/store';

const store = useStore()

const pageStyle = computed(() => store.getPageMetaStyle)
</script>

<template>
  <page-meta :page-style="pageStyle" />

  <!-- ↓ 自定义导航 -->
  <the-nav-bar title="音乐社区" :back="false" :filter="false" :bg="true" />

  <!-- ↓ 播放器 -->
  <the-player-bottom-bar />

  <view style="margin-top: 56px;">
  </view>
</template>

<style lang="scss" scoped>
</style>
