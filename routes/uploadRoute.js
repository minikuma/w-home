/**
 * Created by wminikuma@gmail.com on 2020/10/13
 * Blog : https://minikuma-laboratory.tistory.com/
 * Github : http://github.com/minikuma
 */
const path = require('path');
const multer = require('multer');
const router = require('express').Router();

// 파일 업로드 로직 (Refactoring 대상)
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

// GET - Default Page
router.get('/', (req, res) => {
    res.send('index');
});

// 업로드 라우터
router
    .post('/upload', upload.array('print', 1), function (req, res) {
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

module.exports = router;