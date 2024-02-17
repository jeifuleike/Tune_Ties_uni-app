<script lang="ts" setup>
import { ref, watch } from 'vue';

import { useStore as useUserStore } from "@/store/user";
import { useStore as useChatStore } from "@/store/chat"
const userStore = useUserStore()
const chatStore = useChatStore()

const props = defineProps<{
  modelValue: boolean
  payload: number
}>()

const match = ref<boolean>(false)
const emit = defineEmits (['update:modelValue'])

watch(() => props.modelValue, (nVal, oVal) => {
  if(nVal) {
    match.value = nVal
    startMatching()
  }
})

async function startMatching() {
  if (chatStore.matchSocket === null) {
    await chatStore.addMatchSocket({
            token: userStore.token,
            payload: props.payload
          })
    // 匹配成功后获取并加入对方信息
    chatStore.matchSocket.on('message', async (res:any) => {
      const { userId, avatar, userName } = res.data
      chatStore.setFriendInfo({
        userId,
        avatar,
        userName
      })
      if (res.state) {
        uni.showToast({
          title: '匹配成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          uni.navigateTo({
            url: `../chat/musicChat`
          })
        },2000)
        match.value = false
        emit('update:modelValue', false)
      }
    })
  }
}

function close() {
  match.value = false
  chatStore.qeitMatchSocket()
  emit('update:modelValue', false)
}
</script>

<template>
  <u-popup 
    :show="match" 
    :round="50"
    mode="center"
  >
    <view class="popupMain">
      <u-loading-icon
        mode="circle"
        text="匹配中。。。"
        size="80"
        textSize="40"
        :vertical="true"
      />
      <view style="width: 85px; height: 40px;">
        <u-button @click="close" type="error">取消匹配</u-button>
      </view>
    </view>
  </u-popup>
</template> 

<style lang="scss">
.popupMain {
  height: 450rpx;
  width: 350rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>