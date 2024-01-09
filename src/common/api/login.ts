import { Request } from "../apiService";
import api from "../apiExpress";
const request = new Request().http

export function register(data: object) {
  return request({
    url: api.LOGIN.POST_REGISTER, 
    method: "POST",
    data: data
  })
}

export function getUserInfo() {
  return request({
    url: api.LOGIN.GET_USERINFO, 
    method: "GET", 
  })
}
