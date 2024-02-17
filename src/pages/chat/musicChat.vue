
<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import leftBubble from "./components/leftBubble.vue";
import rightBubble from "./components/rightBubble.vue";
import TheNavBar from "@/components/TheNavBar.vue";
import ThePopupChats from "@/components/ThePopupChats.vue"
import { useStore as useChatStore } from "@/store/chat"
import { useStore as useUserStore } from "@/store/user"
import dayjs from "dayjs";
import { onUnload } from "@dcloudio/uni-app";
const chatStore = useChatStore()
const userStore = useUserStore()

const input = ref('');

// 接收消息
function handleGetTxt(res: any) {
  console.log(res.data)
  const data = res.data
  // 当最新消息距离上一条消息大于5分钟就显示当前时间
  if (chatStore.chatHistory.length === 0 || data.time - chatStore.chatHistory[chatStore.chatHistory.length - 1].time > 5 * 60 * 1000) {
    data.showTime = true
  } else {
    data.showTime = false
  }
  chatStore.addChatHistory(data)
  // 处理接收到的消息
}

chatStore.matchSocket.on('getTxt', handleGetTxt);

watch(chatStore.friendInfo, (nVal) => {
  if (nVal.userId === -1) return
  // 监听断开连接
  function handleOtherOut(res: any) {
    chatStore.qeitMatchSocket()
    uni.showToast({
      title: '对方已经退出聊天！',
      icon: 'none',
      duration: 2000
    })
    setTimeout(() => {
      const curPages = getCurrentPages()
      // 当没有上一页的时候直接返回主页
      if (curPages.length === 1) {
        uni.switchTab({
          url: '../index/home'
        })
      } else {
        uni.navigateBack({ delta: 1 })
      }
    }, 2000)
  }

  chatStore.matchSocket.on('otherOut', handleOtherOut);
}, { immediate: true })

async function submit() {
  if(input.value.length > 0) {
    chatStore.matchSocket.emit('pushTxt', input.value );
    input.value = ''
  }
}

function iconClick() {
  uni.$emit('popupOpen', [{ name: '添加为联系人' }, { name: '退出聊天' }])
}

onUnload(() => {
  uni.$emit('popupClose')
  // 在组件销毁时取消事件监听器
  chatStore.matchSocket.off('getTxt', handleGetTxt);
})

</script>
<template>
  <view class="chat-container">
    <the-nav-bar :title="chatStore.friendInfo.userName" :back="true" :filter="false" :bg="true" />
  	<view class="msg-container">
  	  <scroll-view :scroll-y="true" :scroll-into-view="`msg${chatStore.chatHistory.length-1}`" :scroll-with-animation="true">
		<view class="tagView" v-if="chatStore.chatHistory.length === 0">
		  <u-tag text="快来聊天吧"/>
		</view>
  	  	<view class="msg-list" >
  	  	  <view class="msg-item" :id="`msg${index}`" v-for="(msg, index) in chatStore.chatHistory" :key="msg.id">
			<view class="tagView" v-if="msg.showTime">
			  <u-tag :text="dayjs(msg.time).format('M月D日 HH:mm')"/>
			</view>
  	  	  	<left-bubble
			  v-if="msg.userId !== userStore.userInfo.userId"
			  :message="msg.txt"
			  :avatarUrl="msg.avatar"
			/>
  	  	  	<right-bubble
			  v-else
			  :message="msg.txt"
			  :avatarUrl="msg.avatar"
			/>
  	  	  </view>
  	  	</view>
  	  </scroll-view>
  	</view>
  	<view class="bottom-input">
	  <u-icon
	    name="plus-circle"
	    color="black" 
		size="60"
		@click="iconClick"
	  />
  	  <view class="textarea-container">
  	  	<textarea
  	  	  auto-height
  	  	  fixed="true"
  	  	  confirm-type="send"
  	  	  v-model="input"
  	  	  @confirm="submit"
  	  	/>
  	  </view>
  	  <button
  	  	style="
  	  	  width: 70px;
  	  	  height: 30px;
  	  	  line-height: 30px;
  	  	  margin: 0 10px;
		  color: #fff;
		  border-radius: 5px;
  	  	"
		:style="{ backgroundColor: !input? '#85d8ad' : '#05C160' }"
		:disabled="!input"
  	  	@click="submit"
  	  >
  	  	发送
  	  </button>
  	</view>
	<ThePopupChats/>
  </view>

</template>

<style lang="scss">
.chat-container {
  .msg-container {
	background-color: #EDEDED;
  	padding: 65px 5px 50px 5px;
  	height: calc(100vh - 125px);
  	scroll-view {
  	  height: 100%;
  	}
  }
  .bottom-input {
  	display: flex;
  	align-items: flex-end;
  	position: fixed;
  	bottom: 0px;
  	background-color: #F7F7F7;
  	box-shadow: 0px -10px 30px #F7F7F7;
	border-top: 1px solid #D8D8D8;
	justify-content: space-around;
	align-items: center;
	padding: 10px 0;
	width: 100%;
  	.textarea-container {
  	  background-color: #ffffff;
  	  padding: 5px;
  	  textarea {
  	  	width: calc(100vw - 140px);
  	  	background-color: #ffffff;
  	  }
  	}
  }
}
.tagView {
  display: flex;
  justify-content: center;
  align-items: center;
  .u-tag-wrapper {
	view {
	  border-color: #EDEDED;
	  background-color: #EDEDED;
	  text {
	    font-size: 11px;
		color: #8D8D8D;
	  }
	}

  }
}

</style>