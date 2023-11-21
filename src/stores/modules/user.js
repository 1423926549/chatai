import {defineStore} from "pinia";
import {ref} from "vue";

export const useUserStore = defineStore('user', () => {
    const shortToken = ref('');
    const longToken = ref('');

    const setShortToken = (newToken) => {
        shortToken.value = newToken;
    }
    const setLongToken = (newToken) => {
        longToken.value = newToken;
    }
    const removeShortToken = () => {
        shortToken.value = '';
    }
    const removeLongToken = () => {
        longToken.value = '';
    }


    return {
        shortToken,
        longToken,
        setShortToken,
        setLongToken,
        removeShortToken,
        removeLongToken
    }
}, {
    persist: true
})