import { defineStore } from "pinia";
import { ref } from "vue";

export const useTokenStore = defineStore('token', {
    state: () => {
        return {
            token: ref(''),
        };
    },
    actions: {
        setToken(newToken) {
            this.token = newToken;
        },
        removeToken() {
            this.token = '';
        }
    },
    persist: true,
});
