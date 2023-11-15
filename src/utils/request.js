import axios from "axios";//创建一个axios的对象

//生成一个axios的实例
const request=axios.create({
    baseURL:"http://localhost:8080/api",// baseURL会在发送请求的时候拼接在url参数前面
    timeout:1000 * 60,//请求超时
});

request.interceptors.request.use(config => {
    return config;
}, err => {
    return Promise.reject(err)
})


//响应拦截器
request.interceptors.response.use(response => {
    return response;
}, err => {
    return Promise.reject(err)
})

export default request;//导出