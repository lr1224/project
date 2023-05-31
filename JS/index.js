const closeBtn = $(".close");
const chatWindow = $(".chat-container");
const chatInput = $(".msg-container #txtMsg");
const chatSend = $(".msg-container button");
const USER = "user";
const MACHINE = "machine";

closeBtn.addEventListener("click", closeWindow);
function closeWindow() {
    API.loginOut();
    location.href = "./login.html";
}

chatSend.addEventListener("click", (e) => {
    e.preventDefault();
    sendMessage();
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
    }
});

async function sendMessage() {
    if (chatInput.value.trim()) {
        const inpMsg = chatInput.value;
        chatInput.value = "";
        createChat(USER, inpMsg, Date.now());
        const msg = await getMessage(inpMsg);
        createChat(MACHINE, msg.content, Date.now());
    }
}

(async function () {
    //获取用户信息
    const userInfo = await API.profileApi();
    if (userInfo.code !== 0) {
        alert(userInfo.msg);
        location.href = "./login.html";
        return;
    }
    const nickname = $("#nickname");
    const loginId = $("#loginId");
    nickname.innerText = userInfo.data.nickname;
    loginId.innerText = userInfo.data.loginId;
    const resp = await API.getMessageApi();
    console.log();
    resp.data.forEach((item) => {
        if (item.from) {
            createChat(USER, item.content, item.createdAt);
        } else {
            createChat(MACHINE, item.content, item.createdAt);
        }
    });
})();

/**
 * 创建对话框
 * @param {*} user 发送信息的对象 user/machine
 * @param {*} content 消息内容
 * @param {*} time 时间戳
 */
function createChat(user, content, time) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (user === "user") {
        div.classList.add("me");
        div.innerHTML = `
            <img class="chat-avatar" src="./asset/avatar.png" />
            <div class="chat-content">${content}</div>
            <div class="chat-date">${timeFormatter(time)}</div>
        `;
    } else {
        div.innerHTML = `
            <img class="chat-avatar" src="./asset/robot-avatar.jpg" />
            <div class="chat-content">${content}</div>
            <div class="chat-date">${timeFormatter(time)}</div>
        `;
    }
    chatWindow.append(div);
    setScroll();
}

/**
 * 根据发送内容获取AI返回的消息
 * @param {*} content 发送内容
 * @returns 返回一个对象，对象内容是AI返回的消息和时间戳
 */
async function getMessage(content) {
    const resp = await API.sendMessageApi(content);
    if (resp.code === 0) {
        return {
            content: resp.data.content,
            time: resp.data.createAt,
        };
    } else {
        alert(resp.msg);
        closeBtn.click();
    }
}

/**
 * 对时间戳格式化
 * @param {*} data 时间戳
 * @returns 返回样式2022-04-29 14:18:13
 */
function timeFormatter(data) {
    const date = new Date(data);
    const year = date.getFullYear();
    const mon = padStart("" + (date.getMonth() + 1));
    const day = padStart("" + date.getDate());
    const hour = padStart("" + date.getHours());
    const min = padStart("" + date.getMinutes());
    const sec = padStart("" + date.getSeconds());
    return `${year}-${mon}-${day} ${hour}:${min}:${sec}`;
}

function padStart(str) {
    return str.padStart(2, "0");
}

function setScroll() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
