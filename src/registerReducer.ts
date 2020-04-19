import { Reducer } from 'redux';

interface RegisterReducerBase {
    register: (reducer: Reducer, reducerName: string) => void,
    getReducer: () => ReducerCollector,
    onChangeReducer?: (reducerCollector: ReducerCollector) => void
}

interface ReducerCollector {
    [key: string]: Reducer
}

/**
 * 用于监听是否有新的reducer加载进来，可用于基于redux的代码分割
 *
 * @class RegisterReducer
 * @implements {RegisterReducerBase}
 */
class RegisterReducer implements RegisterReducerBase {

    /**
     * reducers字典
     *
     * @type {ReducerCollector}
     * @memberof RegisterReducer
     */
    private reducerCollector: ReducerCollector = {}

    /**
     * 注册新的reducer
     *
     * @memberof RegisterReducer
     */
    public register = (reducer: Reducer, reducerName: string): void => {
        this.reducerCollector = {
            ...this.reducerCollector,
            [reducerName]: reducer
        };
        this.onChangeReducer && this.onChangeReducer(this.reducerCollector);
    }

    /**
     * 获取reducer字典
     *
     * @memberof RegisterReducer
     */
    public getReducer = () => {
        return this.reducerCollector;
    }

    /**
     * 注册reduce后回调
     *
     * @memberof RegisterReducer
     */
    public onChangeReducer?: (reducerCollector: ReducerCollector) => void
}

const Register = new RegisterReducer();

export default Register;


