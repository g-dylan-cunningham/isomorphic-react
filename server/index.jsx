import express from "express";
import yields from "express-yields";
import fs from "fs-extra";
import webpack from 'webpack';
import { argv } from 'optimist';
import { get } from 'request-promise';
import { question, questions } from '../data/api-real-urls';
import { delay } from 'redux-saga';
import getStore from '../src/getStore';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import React from 'react';
import App from '../src/App';

const port = process.env.PORT || 3000;
const app = express();

// if our api is working, we'll use live data, otherwise we use mock
// we set this in our run script flag - see readme
const useLiveData = argv.useLiveData === "true";
const useServerRender = argv.useServerRender === "true";

function * getQuestions(){
    let data;
    if(useLiveData){
        data = yield get(questions,{gzip:true});
    } else {
        data = yield fs.readFile('./data/mock-questions.json', 'utf-8');
    }
    return JSON.parse(data);
}

function * getQuestion(question_id){
    let data;
    if(useLiveData){
        // console.log("* getQuestion - live data in use")
        data = yield get(question(question_id), {gzip:true,json:true})
    } else {
        // console.log("* getQuestion - mock data in use")
        const questions = yield getQuestions();
        const question = questions.items.find(_question => _question.question_id == question_id);
        questions.body = `mock question body ${question_id}`;
        data = {items: [question]};
    }
    return data;
}

app.get('/api/questions', function * (req,res){
    const data = yield getQuestions();
    yield delay(100);
    // console.log('data from api/questions', data)
    res.json(data);
})

app.get('/api/questions/:id', function * (req, res) {
    // console.log("api/questions/:id", req.params.id)
    const data = yield getQuestion(req.params.id);
    yield delay(100);
    // console.log('data from api/questions/:id', data)
    res.json(data);
})

if (process.env.NODE_ENV === 'development') {
    // console.log('NODE_ENV = development')
    // cant use import statements inside of an if block - use require instead
    const config = require('../webpack.config.dev.babel').default;
    const compiler = webpack(config)

    // install middleware on express with app.use
    app.use(require('webpack-dev-middleware')(compiler,{
        noInfo:true
    }))
    app.use(require('webpack-hot-middleware')(compiler))
}

app.get(['/'], function * (req, res){
    let index = yield fs.readFile('./public/index.html', "utf-8");

    const initialState = {
        questions: []
    };

    const questions = yield getQuestions();
    initialState.questions = questions.items;

    const store = getStore(initialState);

    if (useServerRender) {
        const appRendered = renderToString(
            <Provider store={store}>
                <App />
            </Provider>
        );
        index = index.replace(`<%= preloadedApplication %>`, appRendered)
    } else {
        index = index.replace(`<%= preloadedApplication %>`, `please wait while we load applicaton`)
    }


    res.send(index);
});

app.listen(port, '0.0.0.0', ()=>console.log(`App is listening on port ${port}`));
