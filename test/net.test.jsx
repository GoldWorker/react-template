import RequestBase from '../src/net';

const http = new RequestBase({
    baseUrl: 'http://www.brandf.cn:8010',
    withCredentials: 'include',
    timeout: 1000
});

describe('Net Tool', () => {
    it('should ', () => {
        expect(1+1).toBe(2);
    });
});
