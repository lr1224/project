const API = (function () {
    const BASE_URL = "https://study.duyiedu.com";
    const TOKEN_KEY = "authToken";

    function get(path) {
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path, {
            method: "GET",
            headers,
        });
    }

    function post(path, bodyObj) {
        const headers = {
            "Content-Type": "application/json",
        };
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(bodyObj),
        });
    }

    /**
     * 用户注册API调用
     * @param {*} userInfo 用户信息
     */
    async function registerApi(userInfo) {
        const resp = await post("/api/user/reg", userInfo);
        return await resp.json();
    }

    /**
     * 登录API调用
     * @param {*} loginInfo 登录信息
     */
    async function loginApi(loginInfo) {
        const resp = await post("/api/user/login", loginInfo);
        const body = await resp.json();
        //将响应头的token保存localstorage
        if (body.code === 0) {
            const authToken = resp.headers.get("authorization");
            localStorage.setItem(TOKEN_KEY, authToken);
        }
        return body;
    }

    /**
     * 用户账号名检测
     * @param {*} loginId 账号名
     */
    async function existsApi(loginId) {
        const resp = await get(`/api/user/exists?loginId=${loginId}`);
        return await resp.json();
    }

    /**
     * 当前用户的登录信息
     */
    async function profileApi() {
        const resp = await get("/api/user/profile");
        return await resp.json();
    }

    /**
     * 发送信息
     * @param {*} content 内容
     */
    async function sendMessageApi(content) {
        const resp = await post("/api/chat", {
            content: content,
        });
        return await resp.json();
    }

    /**
     * 获取聊天记录
     */
    async function getMessageApi() {
        const resp = await get("/api/chat/history");
        return await resp.json();
    }

    function loginOut() {
        localStorage.removeItem(TOKEN_KEY);
    }
    return {
        registerApi,
        loginApi,
        existsApi,
        profileApi,
        sendMessageApi,
        getMessageApi,
        loginOut,
    };
})();
