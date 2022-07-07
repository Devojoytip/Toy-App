const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    //fieldname
    avatar: {
        type: String
    }
}, {
    timestamps: true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', AVATAR_PATH));
        //cb- callback fn, 1st arg - null , 2nd arg- path where files stored
        // path.join(__dirname,'..',AVATAR_PATH) means path= models/ + .. + /uploads/users/avatars
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

userSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
//.single() means only 1 file be uploaded

userSchema.statics.avatarPath = AVATAR_PATH;

const User = new mongoose.model('User', userSchema);

module.exports = User;