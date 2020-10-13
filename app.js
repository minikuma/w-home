/**
 * Created by wminikuma@gmail.com on 2020/10/12
 * Blog : https://minikuma-laboratory.tistory.com/
 * Github : http://github.com/minikuma
 */

const express = require('express');
const fs = require('fs');
const serveStatic = require('serve-static');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const router = express.Router();
const app = express();

app.set('port', 4000);
app.use(express.static(__dirname + '/public')); // html 적용
app.use('uploads', serveStatic(path.join(__dirname, 'uploads')));
app.use(cors());

// 파일 업로드 로직
const fileStorage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'uploads'); // 목적지 폴더 지정 (실제 파일 저장 경로)
        },
        filename: function (req, file, callback) {
            let extension = path.extname(file.originalname);
            let baseName = path.basename(file.originalname, extension);
            let finalName = baseName + '_' + Date.now() + extension;
            callback(null, finalName);
        },
    }
);

const upload = multer({
        storage: fileStorage,
        limits: {files: 10, fileSize: 1024 * 1024 * 1024}
    }
);

// 라우터 적용

// 기본 페이지
router.get('/', (req, res, next) => {
    res.send('index');
});

// 업로드 페이지
router.post('/upload', upload.array('print', 1), function (req, res) {
    const files = req.files;
    if (files.length > 0) {
        console.log('files = ' + files[0]);
    } else {
        console.log('파일 없음');
    }
    res.redirect('/upload.html');
    // res.writeHead(200, {"Content-Type": "text/html;charset=utf8"})
    // res.write('<h3>file upload complete :)</h3>')
    // if (Array.isArray(files)) {
    //     files.forEach(
    //         function (elem) {
    //             res.write('<h3>' + 'original file: ' + elem.originalname + '</h3>');
    //             res.write('<h3>' + 'storage file: ' + elem.filename + '</h3>');
    //             res.end();
    //         }
    //     )
    // }
});

app.use('/', router); // 라우터 기본 경로 등록

app.all('*', function (req, res) {
    res.status(404).send('<h1> 요청 페이지 없음 </h1>')
});

app.listen(4000, () => {
    console.log("Node js Express Server Start!");
});

