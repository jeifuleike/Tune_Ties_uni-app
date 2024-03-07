import { Request } from "../apiService";
import api from "../apiExpress";
const request = new Request().http

// 获取首页排版
export function getHomeTypeset() {
  return request({
    url: api.HOME.GET_Home, 
    method: "GET"
  })
}
