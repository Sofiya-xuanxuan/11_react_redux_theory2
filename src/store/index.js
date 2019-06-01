import {createStore, applyMiddleware, combineReducers} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import fruitReducer from './fruit.redux';
import user from './user.redux'

import createSagaMiddleware from 'redux-saga';
import mySaga from './saga'

//创建saga中间件并注册
const sagaMiddleware = createSagaMiddleware();

//参数2是中间件
const store = createStore(
    combineReducers({fruit: fruitReducer, user}),
    applyMiddleware(logger, thunk, sagaMiddleware)
);
//需要run一下
sagaMiddleware.run(mySaga);
export default store;