import axios from "axios";
import {ElMessage} from "element-plus";
import {useUserStore} from "@/stores";
//创建一个axios的对象

const baseURL = "http://localhost:9996/api"

//生成一个axios的实例
const request=axios.create({
    baseURL,
    timeout:1000 * 60,//请求超时
});

request.interceptors.request.use((config) => {
    const userStore = useUserStore()
    if (userStore.shortToken) {
        config.headers.shortToken = userStore.shortToken
    }
    if (userStore.longToken) {
        config.headers.longToken = userStore.longToken
    }
    return config;
}, (err) => {
    return Promise.reject(err)
})


//响应拦截器
request.interceptors.response.use(res => {
    // console.log(res)
    // 设置token
    const shortToken = res.config.headers.shortToken
    const longToken = res.config.headers.longToken
    const userStore = useUserStore()
    if (shortToken) {
        userStore.setShortToken(shortToken)
    }
    if (longToken) {
        userStore.setLongToken(longToken)
    }

    // 处理 请求
    if (res.data.code === 200) {
        return res.data.data;
    }
    ElMessage.error(res.data.message || '服务器异常')
    return Promise.reject(res.data);
}, err => {
    if (err.response?.status === 401) {
        ElMessage.error('未登录')
    }
    ElMessage.error(err.response.data.message || '服务器异常')
    return Promise.reject(err)
})

export default request;//导出