import RequestBase from '../net';

const http = new RequestBase({
    baseUrl: 'http://www.brandf.cn:8010',
    withCredentials: 'include',
    timeout: 1000,
    retryCount: 3
});

export const getConnectorList = (param = { name: 'asdf123', age: 123 }) => {
    return http.put('/article', param, {
        // handers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // }
    });
};

// export const getConnectorLists = (param = { name: 'asdf123', age: 123 }) => {
//     return http.get('/article/all', param);
// };
// function animateScroll(num = 100) {
//     let n = 0;
//     function step() {
//         console.log(n);
//         if (n < num) {
//             window.requestAnimationFrame(step);
//         }
//         n++;
//     }
//     // window.requestAnimationFrame(step);
//     step();
// }
// animateScroll();
