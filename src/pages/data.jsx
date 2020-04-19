import RequestBase from '../net';

const http = new RequestBase({
    baseUrl: 'http://www.brandf.cn:8010',
    withCredentials: 'include',
    timeout: 1000
});

export const getConnectorList = (param = { name: 'asdf123', age: 123 }) => {
    return http.post('/article', param, {
        hander: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

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
