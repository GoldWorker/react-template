
interface NetFileBase {
    mergeOption: (option: UploadOption) => void,
    createChunks(file: File): Array<File | Blob>,
    createRequest(url: string, data: any, onProgress: (e: ProgressEvent) => void): Promise<any>,
    createRequestList<T>(fileList: T[]): Array<Promise<any>>,
    upload(file: File): void,
    reStart(): void,
    stop(): void,
    continue(): void,
    onProgress?: (e: ProgressEvent, resoult: ProgressResult) => void,
}

interface UploadOption {
    url: string,
    isChuncks: boolean,
    chunksSize: number
}

interface FilePercent {
    percent: number,
    total: number,
    loaded: number
}

interface ProgressResult {
    chuncksPercent: FilePercent[],
    percent: number,
    chunksLength: number
}

export default class NetFile implements NetFileBase {
    private _defaultOption: UploadOption = {
        url: '',
        isChuncks: true,
        chunksSize: 1024 * 10
    }

    // 用于stop
    private _requestList: Array<XMLHttpRequest> = []
    private _readyRequestList: Array<XMLHttpRequest> = []

    // 用于restart
    private _requestPromiseList: Array<Promise<any>> = []
    private _readyRequestPromiseList: Array<Promise<any>> = []

    public result: ProgressResult = {
        chuncksPercent: [],
        percent: 0,
        chunksLength: 1
    }

    constructor(option: UploadOption) {
        this.mergeOption(option);
    }

    mergeOption(option: UploadOption): void {
        Object.assign(this._defaultOption, option);
    }

    createChunks(file: File): Array<File | Blob> {
        const fileSize = file.size;
        const chunksSize = this._defaultOption.chunksSize;
        const chunksList: Blob[] = [];
        if (!fileSize) {
            return [file];
        }
        let cur = 0;
        while (cur < fileSize) {
            chunksList.push(file.slice(cur, cur + chunksSize));
            cur += chunksSize;
        }
        return chunksList;
    }

    createRequest(url: string, data: any, onProgress: (e: ProgressEvent) => void): Promise<any> {
        const xhr = new XMLHttpRequest();
        const runner = new Promise((resolve, rejest) => {
            xhr.open('post', url);
            xhr.onprogress = onProgress;
            xhr.onload = (): void => {
                const index = this._readyRequestList.indexOf(xhr);
                if (this._readyRequestList.length && index > -1) {
                    this._readyRequestList.splice(index, 1);
                }
                resolve();
            };
            xhr.onerror = (e: ProgressEvent): void => {
                rejest(e);
            };
            console.log(data);
            xhr.send(data);
            this._requestList.push(xhr);
            this._readyRequestList.push(xhr);
        }).then(() => {
            const index = this._readyRequestPromiseList.indexOf(runner);
            if (this._readyRequestPromiseList.length && index > 0) {
                this._readyRequestPromiseList.splice(index, 1);
            }
        });
        this._readyRequestPromiseList.push(runner);
        this._requestPromiseList.push(runner);
        return runner;
    }

    createRequestList<T>(fileList: T[]): Array<Promise<any>> {
        return fileList.map((file, i) => {
            const { url } = this._defaultOption;
            return this.createRequest(url, file, (e: ProgressEvent) => {
                const { loaded, total } = e;
                this.result.chuncksPercent[i] = {
                    percent: loaded * 100 / total,
                    total,
                    loaded
                };
                this.result.percent = Number((this.result.chuncksPercent.map(item => item.percent).reduce((a, b) => a + b, 0) / this.result.chunksLength).toFixed(4));
                this.onProgress && this.onProgress(e, this.result);
            });
        });
    }

    public upload(file: File): Promise<any> {
        const chunksList = this.createChunks(file);
        chunksList.forEach((item, i) => {
            this.result.chuncksPercent.push({
                percent: 0,
                total: 0,
                loaded: 0
            });
        });
        this.result.chunksLength = chunksList.length;
        const requestList = this.createRequestList(chunksList);
        return Promise.all(requestList);
    }

    public reStart(): Promise<any> | null {
        if (this._requestPromiseList.length) {
            this._readyRequestPromiseList = this._requestPromiseList;
            this._readyRequestList = this._requestList;
            return Promise.all(this._readyRequestPromiseList);
        }
        return null;
    }

    public stop(): void {
        this._readyRequestList.forEach((xhr: XMLHttpRequest) => {
            xhr.abort();
        });
    }

    public continue(): Promise<any> | null {
        if (this._readyRequestPromiseList.length) {
            Promise.all(this._readyRequestPromiseList);
        }
        return null;
    }

    public onProgress?: (e: ProgressEvent, resoult: ProgressResult) => void
}
