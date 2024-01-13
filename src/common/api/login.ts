import { Request } from "../apiService";
import api from "../apiExpress";
const request = new Request().http

// 注册
export function register(data: object) {
  return request({
    url: api.LOGIN.POST_REGISTER, 
    method: "POST",
    data: data
  })
}

// 用户信息
export function getUserInfo() {
  return request({
    url: api.LOGIN.GET_USERINFO, 
    method: "GET", 
  })
}

// 登录
export function login(data: object) {
  return request({
    url: api.LOGIN.POST_LOGIN, 
    method: "POST",
    data: data
  })
}
