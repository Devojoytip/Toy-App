const express = require('express');

const router = express.Router();
const toysApi = require("../../../controllers/api/v1/toys_api");

router.post('/', toysApi.searchToy);

module.exports = router;