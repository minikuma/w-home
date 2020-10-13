/**
 * Created by wminikuma@gmail.com on 2020/10/12
 * Blog : https://minikuma-laboratory.tistory.com/
 * Github : http://github.com/minikuma
 */

const express = require('express');
const fs = require('fs');
const serveStatic = require('serve-static');
const path = require('path');
const cors = require('cors');
const routes = require('./routes/uploadRoute');
const app = express();

app.set('port', 4000);
app.use(express.static(__dirname + '/public')); // html 적용
app.use('uploads', serveStatic(path.join(__dirname, 'uploads')));
app.use(cors());
app.use('/', routes); // 라우터 기본 경로 등록

app.all('*', function (req, res) {
    res.status(404).send('<h1> 요청 페이지 없음 </h1>')
});

app.listen(4000, () => {
    console.log("Node js Express Server Start!");
});

