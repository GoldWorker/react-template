import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, BrowserRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './storeBase';
import App from './pages/app';
import './main.scss';
// import './less/theme.less'

const requireAll = (requireContext) => requireContext.keys().map(requireContext);
const req = require.context('./icons', false, /\.svg$/);
requireAll(req);

if (module.hot) {
    module.hot.accept();
}

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App store={store}/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
