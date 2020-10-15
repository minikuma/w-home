/**
 * Created by wminikuma@gmail.com on 2020/10/12
 * Blog : https://minikuma-laboratory.tistory.com/
 * Github : http://github.com/minikuma
 */

'use strict';

const fs = require('fs');
const multer = require('multer');
const express = require('express');
const path = require('path');
const cors = require('cors');
const router = express.Router();
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/', router);
app.use(cors());

const storage = multer.diskStorage({
   destination(req, file, callback) {
       callback(null, 'uploads');
   },
   filename(req, file, callback) {
       let array = file.originalname.split('.');
       array[0] = array[0] + '_';
       array[1] = '.' + array[1];
       array.splice(1, 0, Date.now().toString());
       const result = array.join('');
       callback(null, result);
   }
});

const upload = multer({
   storage,
   limits: {
       files: 10,
       fileSize: 1024 * 1024 * 1024,
   }
});

// 업로드 라우터
router.post('/', upload.array('print', 1), function (req, res, next) {
    try {
        const files = req.files;
        let originalName = '';
        let fileName = '';
        let mimeType = '';
        let size = 0;

        if (Array.isArray(files)) {
            console.log('files....');
            originalName = files[0].originalname;
            fileName = files[0].filename;
            mimeType = files[0].mimeType;
            size = files[0].size;
        } else {
            console.log('not files....');
            originalName = files[0].originalname;
            fileName = files[0].filename;
            mimeType = files[0].mimeType;
            size = files[0].size;
        }

        console.log(`file: ${originalName}, ${fileName}, ${mimeType}, ${size}`);

        res.writeHead(200, {
           'Content-type': 'text/html;charset=utf8'
        });

        res.write('<h3>upload success</h3>');
        res.write(`<p>original name = ${originalName}, saved name = ${fileName}</p>`);
        res.write(`<p>mime type = ${mimeType}</p>`);
        res.write(`<p>size = ${size}</p>`);
        res.write('<a href="/">처음으로...</a>');
        res.end();
    } catch (error) {
        console.dir(error.stack);
    }
});

// 리스트
router.get('/', function (req, res, next) {

    console.log(`params: ${req.query.id}`);

    if (req.query.id == undefined) {
        fs.readdir('./uploads', function (err, filelist) {
            let title = 'Welcome! Print World!';
            let description = 'Hello, Print';
            let list = '<ul>';
            let i = 0
            while (i < filelist.length) {
                list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a> </li>`;
                i = i + 1;
            }
            list = list + '</ul>'
            // template
            let template = `
                    <!doctype html>
                    <html>
                        <head>
                            <title>WEB1 - ${title}</title>
                            <meta charset="UTF-8">
                        </head>
                        <body>
                            <h1><a href="/">WEB</a></h1>
                            <br>
                            <h1><a href="/upload.html">Print</a></h1>
                            ${list}
                            <h2>${title}</h2>
                            <p>${description}</p>
                        </body>
                    </html>
                `;

            res.writeHead(200);
            res.end(template);
        });
    } else {
        console.log('downloading....');
        fs.readdir('./uploads', function (err, filelist) {
            let title = 'Welcome! Print World!';
            let description = 'Hello, Print';
            let list = '<ul>';
            let i = 0
            while (i < filelist.length) {
                list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a> </li>`;
                i = i + 1;
            }
            list = list + '</ul>'

            // 다운로드
            const uploadFolder = './uploads/';
            const file = uploadFolder + req.query.id;
            console.log('file: ' + file);
            res.download(file);
        });
    }
});

app.listen(4000, () => {
    console.log('Ready to Server....');
});