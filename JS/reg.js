const loginIdCheck = new FiledValidator("txtLoginId", async function (val) {
    if (!val) {
        return "请输入账号";
    }
    const resp = await API.existsApi(val);
    if (resp.data) {
        return "账号已存在，请重新输入";
    }
});

const NicknameCheck = new FiledValidator("txtNickname", async function (val) {
    if (!val) {
        return "请输入昵称";
    }
});

const passwordCheck = new FiledValidator("txtLoginPwd", async function (val) {
    if (!val) {
        return "请输入密码";
    }
});

const confirmPwdCheck = new FiledValidator("txtLoginPwdConfirm", async function (val) {
    if (!val) {
        return "请输入确认密码";
    } else if (val !== passwordCheck.input.value) {
        return "两次输入的密码不相同";
    }
});

const button = $("button");
button.addEventListener("click", async function (e) {
    e.preventDefault();
    const allCheck = FiledValidator.validate(loginIdCheck, NicknameCheck, passwordCheck, confirmPwdCheck);
    const userInfo = {
        loginId: loginIdCheck.input.value,
        nickname: NicknameCheck.input.value,
        loginPwd: passwordCheck.input.value,
    };
    if (allCheck) {
        const result = await API.registerApi(userInfo);
        if (result.code === 0) {
            location.href = "./login.html";
        }
    }
});
