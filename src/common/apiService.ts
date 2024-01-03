import { useStore } from "@/store/user";

const baseURL1 = 'http://localhost:3000'
const baseURL2 = 'http://localhost:4000'


uni.addInterceptor('request', {
  invoke(args) {
    // 如果请求路径以 "/express/api" 开头，则使用 baseURL2，否则使用 baseURL1
    args.url = args.url.startsWith('/express/api') ? baseURL2 + args.url : baseURL1 + args.url;
  }
})


/**
 *
 * @param url url
 * @param params 参数
 * @param noCache 是否在url后添加时间戳，防止缓存
 */
export const get = (
  url: string,
  params: any,
  requireCookie?: boolean,
  noCache?: boolean
): Promise<any> => {

  return new Promise(resolve => {
    const data = params
    if (noCache) data.time = Date.now()

    const uniReq: any = uni.request({
      url,
      data,
      method: 'GET',
      // withCredentials: true,
      sslVerify: true,
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
        // 'Set-Cookie': 'SameSite=None; '
      }
    })

    uniReq
      .then((res: any) => {
        resolve(res.data)
      })
      .catch((err: any) => {
        resolve(err)
      })
  })
}

interface ResponseData {
  state: number;
  data: any;
  msg: string;
}


export class Request {
  http(param: any) {
    // 请求参数
    let url = param.url,
        method = param.method,
        header: any = {},
        data = param.data || {},
        hideLoading = param.hideLoading || false;

    //请求方式:GET或POST(POST需配置
    // header: {'content-type' : "application/x-www-form-urlencoded"},)
    if (method) {
      method = method.toUpperCase(); //小写改为大写
      if (method == "POST") {
        header = {
          'content-type': "application/x-www-form-urlencoded"
        };
      } else {
        header = {
          'content-type': "application/json"
        };
      }
    }

    // 加入用户 token 到请求头
    const token = useStore().token;
    if (token) {
      header.Authorization = `Bearer ${token}`;
    }

    //加载圈
    if (!hideLoading) {
      uni.showLoading({
        title: '加载中...'
      });
    }

    // 返回promise
    return new Promise<ResponseData>((resolve, reject) => {
      // 请求
      uni.request({
        url: url,
        data: data,
        method: method,
        header: header,
        success: (res: any) => {
          // 将结果抛出
          if (!res.data.state) {
            uni.showToast({
              title: res.data.msg,
              icon: 'error',
              duration: 2000
            });
          }
          resolve(res.data)
        },
        //请求失败
        fail: (e: any) => {
          uni.showToast({
            title: "" + e.data.msg,
            icon: 'none'
          });
          resolve(e.data);
        },
        //请求完成
        complete() {
          //隐藏加载
          if (!hideLoading) {
            uni.hideLoading();
          }
          return;
        }
      })
    })
  }
}