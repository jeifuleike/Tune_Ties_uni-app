import { Request } from "../apiService";
import api from "../apiExpress";
const request = new Request().http
// 添加联系人申请
export function addFriendReq(data: object) {
  return request({
    url: api.CHAT.POST_ADDFRIENDREQ, 
    method: "POST",
    data: data
  })
}

// 获取联系人以及请求信息
export function getReqs() {
  return request({
    url: api.CHAT.POST_GETCONTACT,
    hideLoading: true
  })
}

// 通过或者拒绝请求
export function handleFriReq(data: object) {
  return request({
    url: api.CHAT.POST_HANDLEFRIENDREQ,
    method: 'POST',
    data: data
  })
}

// 获取联系人列表
export function getContents() {
  return request({
    url: api.CHAT.GET_CONTENTS
  })
}
