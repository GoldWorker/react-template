interface ValidatorBase {
    config: ValidatorConfig,
    result: ValidatorResult,
    data: Record<string, any>,
    validate(data: Record<string, any>): ValidatorResult,
    validateItem(item: string, val: any): ValidationResultBase | undefined,
    isSubmit(data: Record<string, any>): boolean,
    formatError(type: string, sign: string): string,
    clear(): void
}

interface ValidatorConfig {
    [key: string]: string[]
}

interface ValidatorTypes {
    [key: string]: {
        validate: (value: any, ...orther: any[]) => boolean,
        desc: string
    }
}

interface ValidationResultBase {
    isValid: boolean,
    message: string[]
}

interface ValidatorResult {
    [key: string]: ValidationResultBase
}

export default class Validator implements ValidatorBase {
    public config: ValidatorConfig = {}
    public result: ValidatorResult = {}
    public data: Record<string, any> = {}
    static types: ValidatorTypes = {}

    // constructor() { }

    public validate(data: Record<string, any>): ValidatorResult {
        this.data = data;
        this.result = {};
        const keys = Object.keys(data);
        while (keys.length) {
            const key = keys.shift() || '';
            const value = data[key];
            const res = this.validateItem(key, value);
            if (res) {
                this.result[key] = res;
            }
        }
        return this.result;
    }

    validateItem(key: string, value: any): ValidationResultBase | undefined {
        const itemCheckerList = this.config[key];
        if (!itemCheckerList || !Array.isArray(itemCheckerList)) {
            return undefined;
        }
        const result: ValidationResultBase = {
            isValid: true,
            message: []
        };
        // 遍历检查器
        for (const checkerName of itemCheckerList) {
            const checker = Validator.types[checkerName];
            if (!checker.validate.call(this, value)) {
                result.isValid = false;
                result.message.push(checker.desc);
            }
        }

        return result;
    }
    // 最终验证
    public isSubmit(data: Record<string, any> = {}): boolean {
        data && this.validate(data);
        for (const item in this.data) {
            if (this.result[item] !== undefined && !this.result[item].isValid) {
                return false;
            }
        }
        return true;
    }

    // 结果格式化
    public formatError(type: string, sign = ','): string {
        return this.result[type] && this
            .result[type]
            .message
            .join(sign);
    }

    public clear(): void {
        this.result = {};
    }
}

// 检查处理器checker ex:

Validator.types.isEmpty = {
    validate(value: any): boolean {
        return value !== '';
    },
    desc: '不能为空'
};

Validator.types.isArrayEmpty = {
    validate(value: any[]) {
        return Array.isArray(value) && value.length !== 0;
    },
    desc: '请选择'
};

Validator.types.isInt = {
    validate(value) {
        return /^[1-9]\d*$/.test(value);
    },
    desc: '必须是整数'
};

Validator.types.isName = {
    validate(value) {
        return /^[\u4E00-\u9FA5A-Za-z0-9_]{1,10}$/.test(value);
    },
    desc: '十个字以内，不能包含特殊字符'
};

Validator.types.isEmail = {
    validate(value) {
        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
    },
    desc: '邮箱格式不正确'
};

Validator.types.isPw = {
    validate(value) {
        return /^[!@#$%^&*_A-Za-z0-9]{8,15}$/.test(value);
    },
    desc: '由数组，字母，_@#$等组成，不少于8位'
};
