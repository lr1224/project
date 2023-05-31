/**
 *
 * 对某一个表单项进行验证的构造函数
 */
class FiledValidator {
    /**
     *
     * @param {String} textId 检证对象的id
     * @param {Function} validatotFunc 检测输入内容是否正确的函数，如果通过返回true，否则返回false
     */
    constructor(textId, validatotFunc) {
        this.input = $("#" + textId);
        this.p = this.input.nextElementSibling;
        this.validatotFunc = validatotFunc;
        this.input.addEventListener("focusout", () => {
            this.validate();
        });
    }

    /**
     * 检测内容是否正确，正确true，错误false
     */
    async validate() {
        const err = await this.validatotFunc(this.input.value.trim());
        if (err) {
            this.p.innerText = err;
            return false;
        } else {
            this.p.innerText = "";
            return true;
        }
    }

    /**
     * 对传入的所有验证器进行统一的验证，如果所有的验证均通过，则返回true，否则返回false
     * @param  {...any} validators
     */
    static async validate(...validators) {
        const result = await validators.map((item) => item.validate());
        const resArr = await Promise.all(result).then((resp) => resp);
        return resArr.every((res) => res);
    }
}
