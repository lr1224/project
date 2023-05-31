const loginIdCheck = new FiledValidator("txtLoginId", async function (val) {
    if (!val) {
        return "请填写账号";
    }
});
const passwordCheck = new FiledValidator("txtLoginPwd", async function (val) {
    if (!val) {
        return "请输入密码";
    }
});

const button = $("button");
button.addEventListener("click", async function (e) {
    e.preventDefault();
    const allCheck = FiledValidator.validate(loginIdCheck, passwordCheck);
    const loginInfo = {
        loginId: loginIdCheck.input.value,
        loginPwd: passwordCheck.input.value,
    };
    if (allCheck) {
        const result = await API.loginApi(loginInfo);
        if (result.code === 0) {
            location.href = "./index.html";
        } else {
            loginIdCheck.p.innerText = result.msg;
            passwordCheck.p.innerText = result.msg;
        }
    }
});
