const express = require('express');
const router = express.Router();
const passport = require('passport');

const toysController = require('../controllers/toys_controller');

const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/toys/avatars');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, 'images');
        cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '-toy' + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

const imageUpload = multer({
    storage, limits: {
        fieldSize: 1000000 // 1000000 Bytes = 1 MB
    }, fileFilter
});

router.post('/add-toy', imageUpload.single('toy-file'), toysController.addToy);

router.get('/remove-toy/:id', passport.checkAuthentication, toysController.removeToy);

router.get('/edit-toy/form/:id', passport.checkAuthentication, toysController.editToyForm);
// router.post('/edit-toy/:id', passport.checkAuthentication, toysController.editToy);
router.post('/edit-toy/:id',imageUpload.single('new-toy-file') , toysController.editToy);

router.post('/search-toy', passport.checkAuthentication, toysController.searchToy);

module.exports = router;
