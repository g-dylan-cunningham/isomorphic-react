import {createStore, combineReducers, applyMiddleware } from 'redux';
// we want to most basic reducer possible - one that returns itself -> identity
import { identity } from 'lodash';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import fetchQuestionsSaga from './sagas/fetch-questions-saga';
import * as reducers from './reducers';

export default function(defaultState) {
    // why do i need to define node_env here? something is funny...
    process.env.NODE_ENV='development'

    const sagaMiddleware = createSagaMiddleware();
    const middlewareChain = [sagaMiddleware];
    if(process.env.NODE_ENV === "development") {
        const logger = createLogger();
        middlewareChain.push(logger);
    }
    // console.log("middleware chain", middlewareChain, process.env.NODE_ENV)
    const store = createStore(combineReducers({...reducers}), defaultState, applyMiddleware(...middlewareChain));
    sagaMiddleware.run(fetchQuestionsSaga)
    return store
}