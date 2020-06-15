const router = require('express').Router();

const Category = require('../models/Category.js');

// Get all current categories.
router.get('/api/categories', async (req, res) => {
    const categories = await Category.query().select();
    res.send(categories);
});

module.exports = router;