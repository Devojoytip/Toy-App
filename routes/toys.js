const express = require('express');
const router = express.Router();
const passport = require('passport');

const toysController = require('../controllers/toys_controller');

router.post('/add-toy',toysController.addToy);
router.get('/remove-toy/:id',passport.checkAuthentication,toysController.removeToy);

router.get('/edit-toy/form/:id',passport.checkAuthentication,toysController.editToyForm);
router.post('/edit-toy/:id',passport.checkAuthentication,toysController.editToy);

router.post('/search-toy',passport.checkAuthentication,toysController.searchToy);

module.exports = router;
