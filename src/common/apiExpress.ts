
interface apiType {
  [key: string]: string | { [nestedKey: string]: string };
}

const api = {
  LOGIN: {
    POST_REGISTER: '/user/register',
    GET_USERINFO: '/user/userInfo',
    POST_LOGIN: '/user/login',
    POST_CHANGEUSERINFO: '/user/changeUserInfo'
  }
} satisfies apiType;
// 遍历处理对象给全部api加上/express/api头
function addPrefixToUrls<T extends apiType | string>(data: T): void {
  if (typeof data === 'object') {
    const keys = Object.keys(data)
    keys.forEach(key => {
      if (typeof data[key] === 'string') {
        // 处理字符串，可以添加前缀等操作
        data[key] = '/express/api' + data[key]
      } else {
        // 递归处理嵌套对象
        addPrefixToUrls(data[key]);
      }
    });
  }
}
addPrefixToUrls(api)

export default api