
<script setup lang="ts">
import { ref, reactive } from "vue";
import leftBubble from "./components/leftBubble.vue";
import rightBubble from "./components/rightBubble.vue";
import TheNavBar from "@/components/TheNavBar.vue";
import ThePopupChats from "@/components/ThePopupChats.vue"
import { useStore as useChatStore } from "@/store/chat"
import { useStore as useUserStore } from "@/store/user"
import dayjs from "dayjs";
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { user } from "@/types";
import { getChatHistory } from "@/common/api/chat";
import { toRef } from "@vue/runtime-core";

const chatStore = useChatStore()
const userStore = useUserStore()

const input = ref('');
const historyChat = ref<any[]>([])
const friendInfo = ref<user>({
  userId: -1,
  userName: '',
  sex: 0,
  avatar: '',
  birthday: new Date(),
  region: '',
  label: [],
  listLike: []
})

onLoad(async (query: any) => {
  chatStore.chatSocket.emit('joinRoom', query.id);
  const res = await getChatHistory(query.id)
  friendInfo.value = res.data.friendInfo
})

// 接收消息
function handleGetTxt(res: any) {
  const data = res.data
  // 当最新消息距离上一条消息大于5分钟就显示当前时间
  historyChat.value = data
  // 处理接收到的消息
}

chatStore.chatSocket.on('getTxt', handleGetTxt);

async function submit() {
  if(input.value.length > 0) {
    chatStore.chatSocket.emit('pushTxt', input.value );
    input.value = ''
  }
}

function showTime(lastTime: number, newTime: number) {
if (!lastTime || newTime - lastTime > 5 * 60 * 1000) {
    return true
  } else {
    return false
  }
}



onUnload(() => {
  chatStore.chatSocket.off('getTxt', handleGetTxt);
  chatStore.chatSocket.emit('leverRoom')
})

</script>
<template>
  <view class="chat-container">
    <the-nav-bar :title="friendInfo.userName" :back="true" :filter="false" :bg="true" />
  	<view class="msg-container">
  	  <scroll-view :scroll-y="true" :scroll-into-view="`msg${historyChat.length-1}`" :scroll-with-animation="true">
		<view class="tagView" v-if="historyChat.length === 0">
		  <u-tag text="快来聊天吧"/>
		</view>
  	  	<view class="msg-list" >
  	  	  <view class="msg-item" :id="`msg${index}`" v-for="(msg, index) in historyChat" :key="msg.id">
			<view class="tagView" v-if="showTime(historyChat[index - 1]?.time, msg.time)">
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
  	  	width: calc(100vw - 120px);
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