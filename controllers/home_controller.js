const Toy = require('../models/toy');
const User = require('../models/user');

module.exports.home_fn = async (req, res) => {
    try {
        let wholeToysList = await Toy.find({}).populate('user');
        let arr=[];

        return res.render('home', {
            title: 'Home Page',
            toysList:wholeToysList,
            searchList:arr
        })
                    
    } catch (error) {
        console.log('Error is',error);
        return;
    }

}