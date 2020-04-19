import fetch from 'isomorphic-fetch';
// https://www.cnblogs.com/wonyun/p/fetch_polyfill_timeout_jsonp_cookie_progress.html

enum Credentials {
    default = 'omit',
    sameOrigin = 'same-origin',
    include = 'include'
}

enum Method {
    get = 'get',
    post = 'post',
    delete = 'delete',
    put = 'put'
}

interface DefaultOption {
    baseUrl: string,
    baseUrlMap: Record<string, any>,
    handers: Record<string, any>,
    timeout: number,
    withCredentials: Credentials
}

interface SetOption {
    baseUrl?: string,
    baseUrlMap?: Record<string, any>,
    handers?: Record<string, any>,
    timeout?: number,
    withCredentials?: Credentials
}

interface RequestOption {
    baseApi?: string,
    handers?: Record<string, any>,
    timeout?: number,
    withCredentials?: Credentials
}

interface Interceptor {
    request?(config?: DefaultOption): DefaultOption,
    response?(config?: DefaultOption): DefaultOption,
    timeout?(config?: Record<string, any>): void
}

// interface ResponseError { }

/**
 * 基于fetch的一个网络请求工具
 *
 * @class RequestBase
 */
class RequestBase {

    /**
     * baseUrlMap 应对项目多域名的情况
     *
     * @private
     * @type {DefaultOption}
     * @memberof RequestBase
     */
    private _defaultOpiotn: DefaultOption = {
        baseUrl: '',
        baseUrlMap: {},
        handers: {},
        timeout: 3000,
        withCredentials: Credentials.default
    }
    public interceptor: Interceptor = {}

    constructor(option: SetOption) {
        this.init(option);
    }

    /**
     * 格式化url参数
     *
     * @param {Record<string, any>} params
     * @returns {string}
     * @memberof RequestBase
     */
    public formatParams(params: Record<string, any>): string {
        if (Object.prototype.toString.call(params) !== '[object Object]') {
            return '';
        }
        const res: string[] = [];
        const keys: string[] = Object.keys(params);
        if (!keys.length) {
            return '';
        }
        while (keys.length) {
            const key: any = keys.shift();
            const value = params[key];
            res.push(`${key}=${encodeURIComponent(value)}`);
        }
        return res.join('&');
    }

    /**
     * 获取url参数
     *  
     * @param {string} name
     * @returns {(string | number | undefined)}
     * @memberof RequestBase
     */
    public getParam(name: string): string | number | undefined {
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
        const href = location.href;
        const query = href.substr(href.lastIndexOf('?') + 1);
        const res = query.match(reg);
        if (res != null) {
            return decodeURIComponent(res[2]);
        }
        return undefined;
    }

    /**
     * 获取url参数对象
     *
     * @param {string} url 
     * @returns {Record<string, any>}
     * @memberof RequestBase
     */
    public getParamsObject(url: string): Record<string, any> {
        const query = url.substr(url.lastIndexOf('?') + 1);
        if (!query) {
            return {};
        }
        query.replace(/\?/g, '');
        const paramsJson = `{"${decodeURIComponent(query).replace(/\"/g, '\\"').replace(/\=/g, '":"').replace(/\&/g, '","')}"}`;
        return JSON.parse(paramsJson);
    }


    /**
     * 初始化/合并网络请求配置
     *
     * @param {SetOption} option
     * @memberof RequestBase
     */
    public init(option: SetOption): void {
        Object.assign(this._defaultOpiotn, {
            ...option
        });
    }

    /**
     * 返回符合要求的url
     *
     * @param {string} urlWithoutDomain
     * @param {string} [baseApi]
     * @returns {string}
     * @memberof RequestBase
     */
    public createUrl(urlWithoutDomain: string, baseApi?: string): string {
        if (!urlWithoutDomain) {
            throw new Error('url not find');
        }
        const { baseUrl, baseUrlMap } = this._defaultOpiotn;
        let url: string;
        // 空对象
        if (Object.getOwnPropertyNames(baseUrlMap).length === 0 && Object.getOwnPropertySymbols(baseUrlMap).length === 0) {
            url = baseUrl + urlWithoutDomain;
        } else {
            if (baseApi && !this._defaultOpiotn.baseUrlMap[baseApi]) {
                throw new Error('can not find key in map');
            }
            url = baseApi ? this._defaultOpiotn.baseUrlMap[baseApi] : baseUrl + urlWithoutDomain;
        }
        return url;
    }

    /**
     * 获取cookie by name
     *
     * @param {string} name
     * @returns {string}
     * @memberof RequestBase
     */
    public getCookie(name: string): string {
        const cookies = document
            .cookie
            .split('; ');
        let arr = [];
        for (let i = 0, len = cookies.length; i < len; i++) {
            arr = cookies[i].split('=');
            if (arr[0] === name) {
                return decodeURI(arr[1]);
            }
        }
        return '';
    }

    public uploadFile(method: Method, url: string, file: File, onProgress: (e: any) => any, option: RequestOption): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.open(method, url);
            Object.keys(option.handers || {}).forEach(key => {
                const handles = option.handers || {};
                xhr.setRequestHeader(key, handles[key]);
            });
            // const size = file.size;
            xhr.onload = (e: any): void => {
                const { responseText } = e.target;
                resolve(responseText);
            };
            xhr.onerror = reject;
            if (xhr.upload && onProgress) {
                xhr.upload.onprogress = onProgress; //上传
            }
            xhr.send(file);
        });
    }

    public downloadFile(method: Method, url: string, onProgress: (e: any) => any, option: RequestOption): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.open(method, url);
            Object.keys(option.handers || {}).forEach(key => {
                const handles = option.handers || {};
                xhr.setRequestHeader(key, handles[key]);
            });
            xhr.onload = (e: any): void => {
                const { responseText } = e.target;
                resolve(responseText);
            };
            xhr.onerror = reject;
            if (onProgress) {
                xhr.onprogress = onProgress; //下载
            }
            xhr.send();
        });
    }

    /**
     * timeout polyfill
     *
     * @private
     * @param {string} url
     * @param {Record<string, any>} option
     * @returns {Promise<any>}
     * @memberof RequestBase
     */
    private _newFetch(url: string, option: Record<string, any>): Promise<any> {
        const fetchPromise = fetch(url, option);
        const timeoutPromise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                if (this.interceptor.timeout) {
                    this.interceptor.timeout(option);
                }
                reject('request timeout');
            }, this._defaultOpiotn.timeout);
        });
        return Promise.race([fetchPromise, timeoutPromise]).catch(err => {
            throw new Error(err);
        });
    }

    public get(urlWithoutDomain: string, data?: any, option: RequestOption = {}): Promise<any> {
        const url = this.createUrl(urlWithoutDomain, option.baseApi);
        return this.handleRequest('get', url, data, option);
    }

    public form(urlWithoutDomain: string, data?: any, option: RequestOption = {}): Promise<any> {
        const url = this.createUrl(urlWithoutDomain, option.baseApi);
        return this.handleRequest('postForm', url, data, option);
    }

    public post(urlWithoutDomain: string, data?: any, option: RequestOption = {}): Promise<any> {
        const url = this.createUrl(urlWithoutDomain, option.baseApi);
        return this.handleRequest('post', url, data, option);
    }

    public delete(urlWithoutDomain: string, data?: any, option: RequestOption = {}): Promise<any> {
        const url = this.createUrl(urlWithoutDomain, option.baseApi);
        return this.handleRequest('delete', url, data, option);
    }

    public put(urlWithoutDomain: string, data?: any, option: RequestOption = {}): Promise<any> {
        const url = this.createUrl(urlWithoutDomain, option.baseApi);
        return this.handleRequest('put', url, data, option);
    }

    public upload(urlWithoutDomain: string, file: any, option: RequestOption = {}): Promise<any> {
        const url = this.createUrl(urlWithoutDomain, option.baseApi);
        return this.handleRequest('upload', url, file, option);
    }

    httpReq(method: string, headers: Record<string, any>, data: any, url: string): Promise<any> {
        let formData: FormData;

        switch (method) {
            case 'get':
                return this._newFetch(`${url}?${this.formatParams(data)}`, {
                    method,
                    credentials: this._defaultOpiotn.withCredentials,
                    headers: {
                        ...headers
                    }
                }).then((response) => this.handleResponse(response));
            case 'post':
            case 'delete':
            case 'put':
            case 'update':
                return this._newFetch(url, {
                    method,
                    credentials: this._defaultOpiotn.withCredentials,
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers
                    },
                    body: JSON.stringify(data)
                }).then((response) => this.handleResponse(response));
            case 'postForm':
                formData = new FormData();
                for (const key in data) {
                    if (data[key] instanceof Object) {
                        formData.append(key, JSON.stringify(data[key]));
                    } else {
                        formData.append(key, data[key]);
                    }
                }
                return this._newFetch(url, {
                    method: 'post',
                    credentials: this._defaultOpiotn.withCredentials,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        ...headers
                    },
                    body: formData
                }).then((response) => this.handleResponse(response));
            case 'upload':
                return this._newFetch(url, {
                    method: 'post',
                    credentials: this._defaultOpiotn.withCredentials,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...headers
                    },
                    body: data
                }).then((response) => this.handleResponse(response));
            default:
                throw new Error('not find mesthod');
        }
    }

    /**
     * 处理请求后置callback
     *
     * @param {Record<string, any>} response
     * @returns {Promise<any>}
     * @memberof RequestBase
     */
    handleResponse(response: Record<string, any>): Promise<any> {
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        }
        if (this.interceptor.response) {
            this.interceptor.response(this._defaultOpiotn);
        }
        throw response;
    }

    /**
     * 处理请求前置callback
     *
     * @param {string} reqMethod
     * @param {Record<string, any>} data
     * @param {string} url
     * @returns {Promise<any>}
     * @memberof RequestBase
     */
    handleRequest(reqMethod: string, url: string, data: Record<string, any>, option: RequestOption): Promise<any> {

        if (this.interceptor.request) {
            const option: SetOption = this.interceptor.request(this._defaultOpiotn);
            this.init(option);
        }

        // 请求内部的配置优先级高于拦截器
        if (option.baseApi) {
            delete option.baseApi;
        }
        this.init(option);

        return this.httpReq(reqMethod, this._defaultOpiotn.handers, data, url);
    }

}

export default RequestBase;
