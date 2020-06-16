const router = require('express').Router();

const User = require('../models/User.js');

router.get('/api/users', async (req, res) => {
    const users = await User.query().select().withGraphFetched('role');
    if (req.session.isLoggedIn) {
        res.send(users);
    } else {
        res.send(null);
    }
});

router.get('/api/users/:username', async (req, res) => {
    const username = req.params.username
    const user = await User.query().findOne({
        username: username
    }).withGraphFetched('role');
    console.log(user)
    res.send(user);
});

module.exports = router;