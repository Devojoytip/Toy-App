const Toy = require('../../../models/toy');

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



