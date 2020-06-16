const router = require('express').Router();

const Message = require('../models/Message.js');

// Get all current categories.
router.get('/api/messages/:recieverId', async (req, res) => {

    const recieverId = req.params.recieverId

    if (req.session.isLoggedIn) {
        const messages = await Message.query().select()
            .withGraphJoined('[sender, reciever]')
            .modifyGraph('sender', builder => {
                builder.select('username'),
                    builder.select('avatar')
            })
            .modifyGraph('reciever', builder => {
                builder.select('username'),
                    builder.select('avatar')

            })
            .where('senderId', req.session.user.id)
            .where('recieverId', recieverId)
            .orWhere('senderId', recieverId)
            .where('recieverId', req.session.user.id)
            .orderBy('createdAt', 'ASC');

        res.send(messages);
    }

});

router.post('/api/messages/send', async (req, res) => {
    console.log("Called");
    const {
        recieverID,
        message,
    } = req.body;

    console.log(req.body);

    if (req.session.isLoggedIn && recieverID !== req.session.user.id) {

        await Message.query().insert({
            senderId: req.session.user.id,
            recieverId: recieverID,
            message: message
        });
    }
});

module.exports = router;