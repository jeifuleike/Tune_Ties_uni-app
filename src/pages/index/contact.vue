<!--
Description: 通讯录
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
  <the-nav-bar title="通讯录" :back="false" :filter="false" :bg="true" />
  <view style="margin-top: 56px;">
  </view>
  <!-- ↓ 播放器 -->
  <the-player-bottom-bar />
  <view>
		<up-calendar :show="true"></up-calendar>
		<u-button>打开</u-button>
	</view>
</template>

<style lang="scss" scoped>
</style>
