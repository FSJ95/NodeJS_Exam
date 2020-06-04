const router = require('express').Router();

const User = require('../models/User.js');

router.get('/fetchusers', async (req, res) => {
    const users = await User.query().select().withGraphFetched('role');
    if (req.session.isLoggedIn) {
        res.send(users);
      } else {
          res.send(null);
      } 
});

router.get('/fetchuser/:username', async (req, res) => {
    const username = req.params.username
    const user = await User.query().select().withGraphFetched('role').where({
        username: username
    });
    if (req.session.isLoggedIn) {
        res.send(user);
      } else {
        res.send(null);
      } 
});

router.get('/setsessionvalue', (req, res) => {
    req.session.myValue = "asdasdsa"; // take the value from the request and dynamically set it here
    return res.send({});
});

router.get('/getsessionvalue', (req, res) => {
    return res.send({
        response: req.session.myValue
    });
});

module.exports = router;