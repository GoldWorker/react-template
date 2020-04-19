import {
    createStore,
    applyMiddleware,
    compose,
    combineReducers,
    Reducer
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {
    createLogger
} from 'redux-logger';
import RegisterReducer from './registerReducer';

const loggerMiddleware = createLogger();
const _window: any = window;
const composeEnhancers = _window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initReducer: Reducer = (state = {}) => state;
const reducersNmaes = Object.keys(RegisterReducer.getReducer());

const reducers = reducersNmaes.length ? combineReducers(RegisterReducer.getReducer()) : initReducer;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware, loggerMiddleware)));

RegisterReducer.onChangeReducer = () => {
    const reducers = combineReducers(RegisterReducer.getReducer());
    store.replaceReducer(reducers);
};

export default store;
