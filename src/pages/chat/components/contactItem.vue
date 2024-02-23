<script lang="ts" setup>
import { computed } from "vue"
import dayjs from "dayjs"
import { handleFriReq } from "@/common/api/chat";
const props = defineProps<{
  id?: number,
  avatar: string
  name: string
  lastMsg?: string
  lastTime?: number,
  unReadMsg?: number,
  state?: {
    type: 'Pending' | 'Approved' | 'Rejected',
    user: 'TargetUser' | 'user'
  }
}>()

const emit = defineEmits (['reqData'])
const showState = computed(() => {
  if (props.state) {
    switch(props.state.type) {
      case ('Pending'): 
        return '请求中'
      case ('Approved'): 
        return '通过'
      case ('Rejected'): 
        return '拒绝'
    }
  } else {
    return ''
  }
})

async function handleReq(state: 'Approved' | 'Rejected') {
  const res = await handleFriReq({ friendId: props.id, state })
  emit('reqData')
}

</script>

<template>
  <view class="contactItem">
    <view class="contactImage">
      <image :src="props.avatar"/>
    </view>
    <view class="contactMain">
      <text class="contactName">
        {{ props.name }}
      </text>
      <text class="contactTxt">
        {{ props.lastMsg }}
      </text>
    </view>
    <view class="contactRight">
      <template v-if="props.lastTime">
        <text class="contactTime">
          {{ dayjs(props.lastTime).format('HH:mm') }}
        </text>
        <view>
          <u-badge :value="props.unReadMsg"/>
        </view>
      </template>
      <template v-if="props.state">
        <view style="display: flex; align-items: center; height: 100%;" v-if="props.state.type === 'Pending' && props.state.user === 'TargetUser'">
          <button type="warn" size="mini" @click="handleReq('Rejected')">拒绝</button>
          <button style="margin-left: 5px;" @click="handleReq('Approved')" type="primary" size="mini">同意</button>
        </view>
        <text v-else>{{ showState }}</text>
      </template>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.contactItem {
  height: 40px;
  border-bottom: 1px solid #d4d3d3;
  padding: 7px;
  .contactImage {
    float: left;
    width: 40px;
    height: 40px;
    image {
      width: 40px;
      height: 40px;
      border-radius: 5px;
    }
  }
  .contactMain {
    float: left;
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 10px;
    .contactName {
      font-size: 15px;
      color: #161616;
    }
    .contactTxt {
      font-size: 10px;
      color: #B4B4B4;
    }
  }
  .contactRight {
    height: 100%;
    float: right;
    .contactTime {
      font-size: 10px;
      color: #C0C0C0;
      margin-bottom: 5px;
    }
  }
}
</style>