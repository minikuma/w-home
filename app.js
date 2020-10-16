/**
 * Created by wminikuma@gmail.com on 2020/10/12
 * Blog : https://minikuma-laboratory.tistory.com/
 * Github : http://github.com/minikuma
 */

'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');
const routes = require('./routes/uploadRoute');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/', routes);
app.use(cors());

app.listen(4000, () => {
    console.log('Ready to Server....');
});