import { defineStore } from 'pinia'
import io from '@hyoga/uni-socket.io';

type FriendInfo = {
  userId: number
  avatar: string
  userName: string
}
type HistoryTxt = {
  txt: string
  time: number
  id: string
  showTime: boolean
} & Pick<FriendInfo, 'userId' | 'avatar' | 'userName'>;

export const useStore = defineStore('chat', {
  state: () => {
    return {
      matchSocket: null as any,
      friendInfo: {
        userId: -1,
        avatar: '',
        userName: ''
      } as FriendInfo,
      chatHistory: [] as HistoryTxt[],
      chatSocket: null as any
    }
  },
  actions: {
    // 建立匹配连接
    async addMatchSocket(query: any) {
      this.matchSocket = await io('http://127.0.0.1:4000/matchChats', {
        query: query,
        transports: ['websocket', 'polling'],
        timeout: 5000,
      });
    },
    
    // 清除匹配连接
    qeitMatchSocket() {
      if (this.matchSocket) {
        this.matchSocket.disconnect();
        this.matchSocket = null
      }
      this.friendInfo = {
        userId: -1,
        avatar: '',
        userName: ''
      }
    },

    // 匹配成功添加匹配到的朋友信息
    setFriendInfo(info: FriendInfo) {
      this.friendInfo = info
    },

    // 添加聊天记录
    addChatHistory(txt: HistoryTxt) {
      this.chatHistory.push(txt)
    },

    // 建立联系人聊天
    async addChatSocket(token: number) {
      this.chatSocket = await io('http://127.0.0.1:4000/friendChats', {
        query: { token },
        transports: ['websocket', 'polling'],
        timeout: 5000,
      });
    },
  }
})