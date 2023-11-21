import request from "@/utils/request";


// 登录
export const userLoginService = (data) => {
    return request.post('/user/login', data)
}

// 注册
export const userRegisterService = (data) => {
    return request.post('/user/register', data)
}

// 编辑
export const userEditService = (data) => {
    return request.put('/user/update', data)
}

// 校验密码是否正确
export const userCheckPasswordService = (data) => {
    return request.post('/user/checkPassword', data)
}

// 获取登录状态
export const userCheckLoginService = () => {
    return request.get('/user/isLogin')
}

export const logoutService = () => {
    return request.get('/user/logout')
}
