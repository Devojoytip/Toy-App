const Toy = require('../models/toy');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

// module.exports.addToy = async (req, res) => {
//     try {
//         let new_toy = await Toy.create({
//             name: req.body.name,
//             user: req.user._id,
//             content: req.body.content
//         });
//         await new_toy.save();
//         Toy.uploadedAvatar(req, res, (err) => {
//             if (err) {
//                 console.log('*******Maltar Error:', err);
//             }
//             else {

//                 console.log('req.file is', req.file);

//                 const ext = req.file.mimetype.split("/")[1];
//                 console.log('ext is', ext);
//                 if (req.file) 
//                 {
//                     if (ext === 'jpeg' || ext === 'png') {
//                         if (new_toy.avatar) {
//                             // console.log(new_toy.avatar);
//                             console.log('path is', path.join(__dirname, '..', new_toy.avatar));
//                             const oldAvatar = new_toy.avatar;
//                             fs.access(path.join(__dirname, '..', new_toy.avatar), (err) => {
//                                 if (!err) {
//                                     console.log('path is', path.join(__dirname, '..', new_toy.avatar));
//                                     console.log('file exists');
//                                     fs.unlinkSync(path.join(__dirname, '..', oldAvatar));
//                                     return;
//                                 }
//                                 else {
//                                     console.log('file does not exist');
//                                     return;
//                                 }
//                             });
//                         }
//                         new_toy.avatar = Toy.avatarPath + '/' + req.file.filename;
//                         console.log('new_toy.avatar is : ', new_toy.avatar);
//                         new_toy.save();
//                         return res.redirect('/');
//                     }

//                     else {
//                         new_toy.avatar = Toy.avatarPath + '/' + req.file.filename;
//                         fs.unlinkSync(path.join(__dirname, '..', new_toy.avatar));
//                         new_toy.save();
//                         return res.redirect('/');
//                     }

//                 }
//                 new_toy.save();
//                 return res.redirect('/');
//             }
//         });
//     } catch (error) {
//         console.log('Error', error);
//         return res.redirect('back');
//     }
// }

module.exports.addToy = async (req, res) => {
    try {
        console.log('req.file', req.file);
        let new_toy = await Toy.create({
            name: req.body.name,
            user: req.user._id,
            content: req.body.content,
            image: req.file.path
        });
        await new_toy.save();
        console.log('new_toy', new_toy)
        return res.redirect('/');
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
                await toy.remove();
                console.log('toy deleted');

                let search_list = [];
                let wholeToys_list = await Toy.find({}).populate('user');

                return res.render('home', {
                    title: 'Home Page',
                    toysList: wholeToys_list,
                    searchList: search_list
                });
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
        // console.log(req.file.path);
        let toy = await Toy.findById(req.params.id);
        if (toy) {
            toy.name = req.body.name;
            toy.content = req.body.content;
            console.log('req.file', req.file);
            console.log('typeof(req.file)', typeof(req.file));
            const url=toy.image;
            console.log('url',url);
            if (typeof(req.file)!=='undefined') {
                // toy.image=url;
                toy.image = req.file.path;
            }
            // else{
            //     toy.image = req.file.path;             
            // }
            await toy.save();
            // return res.redirect('/');
            let search_list = [];
            console.log('search_list', search_list);

            let wholeToys_list = await Toy.find({}).populate('user');
            console.log('wholeToys_list', wholeToys_list);

            return res.render('home', {
                title: 'Home Page',
                toysList: wholeToys_list,
                searchList: search_list
            });
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
        let search_list = await Toy.find({ name: req.body.name }).populate('user');
        console.log('search_list', search_list);

        let wholeToys_list = await Toy.find({}).populate('user');
        console.log('wholeToys_list', wholeToys_list);

        return res.render('home', {
            title: 'Home Page',
            toysList: wholeToys_list,
            searchList: search_list
        });
    } catch (error) {
        console.log('Error is', error);
        return;
    }

}



