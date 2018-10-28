import {createStore, combineReducers, applyMiddleware } from 'redux';
// we want to most basic reducer possible - one that returns itself -> identity
import { identity } from 'lodash';

export default function(defaultState = {
    test: "test value for store updating check"
}) {
    const store = createStore(identity, defaultState);
    return store
}