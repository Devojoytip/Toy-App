const Toy = require('../models/toy');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.addToy = async (req, res) => {
    try {
        let new_toy = await Toy.create({
            name: req.body.name,
            user: req.user._id,
            content: req.body.content
        });
        Toy.uploadedAvatar(req, res, (err) => {
            if (err) {
                console.log('*******Maltar Error:', err);
            }
            else {

                console.log('req.file is', req.file);

                const ext = req.file.mimetype.split("/")[1];
                console.log('ext is', ext);
                if (req.file) {
                    if (ext === 'jpeg' || ext === 'png') {
                        if (new_toy.avatar) {
                            // console.log(new_toy.avatar);
                            console.log('path is', path.join(__dirname, '..', new_toy.avatar));
                            const oldAvatar = new_toy.avatar;
                            fs.access(path.join(__dirname, '..', new_toy.avatar), (err) => {
                                if (!err) {
                                    console.log('path is', path.join(__dirname, '..', new_toy.avatar));
                                    console.log('file exists');

                                    fs.unlinkSync(path.join(__dirname, '..', oldAvatar));
                                    return;
                                }
                                else {
                                    console.log('file does not exist');
                                    return;
                                }
                            });
                        }
                        new_toy.avatar = Toy.avatarPath + '/' + req.file.filename;
                        console.log('new_toy.avatar is : ', new_toy.avatar);
                        new_toy.save();
                        return res.redirect('/');
                    }

                    else {
                        new_toy.avatar = Toy.avatarPath + '/' + req.file.filename;
                        fs.unlinkSync(path.join(__dirname, '..', new_toy.avatar));
                        new_toy.save();
                        return res.redirect('/');
                    }

                }
                new_toy.save();
                return res.redirect('/');
            }
        });
    } catch (error) {
        console.log('Error', error);
        return res.redirect('back');
    }
}

module.exports.removeToy = async (req, res) => {
    try {
        // console.log(req.params.id);
        let toy = await Toy.findById(req.params.id);

        if (toy) {
            if (toy.user.toString() === req.user.id) {
                toy.remove();
                console.log('toy deleted');
                return res.redirect('back');
            }
        }
        return res.redirect('back');
    } catch (error) {
        console.log('Error is', error);
        return;
    }

}


module.exports.editToyForm = async (req, res) => {
    try {
        // console.log(req.params.id);
        let toy = await Toy.findById(req.params.id);
        if (toy) {
            return res.render('editToyForm', {
                toy
            })
        }
        return res.redirect('/');
    } catch (error) {
        console.log('Error is', error);
        return;
    }

}

module.exports.editToy = async (req, res) => {
    try {
        // console.log(req.params.id);
        let toy = await Toy.findById(req.params.id);
        if (toy) {
            toy.name = req.body.name;
            toy.content = req.body.content;
            await toy.save();
            return res.redirect('/');
        }
        return res.redirect('/');
    } catch (error) {
        console.log('Error is', error);
        return;
    }

}

module.exports.searchToy = async (req, res) => {
    try {
        // console.log(req.params.id);
        let toy_list = await Toy.find({ name: req.body.name });
        console.log('toy_list', toy_list);

        let wholeToysList = await Toy.find({}).populate('user');
        console.log('wholeToysList', wholeToysList);

        return res.render('home', {
            title: 'Home Page',
            toysList: wholeToysList,
            searchList: toy_list
        });
    } catch (error) {
        console.log('Error is', error);
        return;
    }

}



