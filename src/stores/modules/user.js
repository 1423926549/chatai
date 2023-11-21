import {defineStore} from "pinia";
import {ref} from "vue";

export const useUserStore = defineStore('user', () => {
    const shortToken = ref('');
    const longToken = ref('');
    let isLogin = ref(false);
    const user = ref({
        nickname: '张三',
        username: 'admin',
        header: 'https://chat-he.oss-cn-hangzhou.aliyuncs.com/default_handsome.jpg'
    })

    const setShortToken = (newToken) => {
        shortToken.value = newToken;
    }
    const setLongToken = (newToken) => {
        longToken.value = newToken;
    }
    const setUser = (userInfo) => {
        user.value = userInfo;
    }
    const setLogin = () => {
        isLogin.value = true
    }
    const setNoLogin = () => {
        isLogin.value = false
    }
    const clear = () => {
        shortToken.value = '';
        longToken.value = '';
        user.value = {
            nickname: '',
            username: '',
            header: ''
        }
        isLogin.value = false
    }


    return {
        shortToken,
        longToken,
        user,
        isLogin,
        setShortToken,
        setLongToken,
        setUser,
        setLogin,
        setNoLogin,
        clear
    }
}, {
    persist: {
        key: 'token',
        paths: ['shortToken', 'longToken']
    }
})