const router = require('express').Router();

const Post = require('../models/Post.js');

// Fetch all posts.
router.get('/api/posts', async (req, res) => {
    const posts = await Post.query().select().withGraphJoined('[user, category]')
        .modifyGraph('user', builder => {
            builder.select('username');
        });
    res.send(posts)
});

// Fetch all posts by username.
router.get('/api/posts/user/:username', async (req, res) => {
    const username = req.params.username
    const user = await Post.query().select().withGraphJoined('[user, category]')
        .modifyGraph('user', builder => {
            builder.select('username');
        }).where('user.username', username);
    res.send(user);
});

// Fetch all posts by category.
router.get('/api/posts/category/:category', async (req, res) => {
    const category = req.params.category
    const user = await Post.query().select().withGraphJoined('[user, category]')
        .modifyGraph('user', builder => {
            builder.select('username');
        }).where('category', category);

    res.send(user);
});

// Create new post.
router.post('/api/posts/create', async (req, res) => {

    if (req.session.isLoggedIn) {

        const {
            title,
            content,
            category,
        } = req.body;

        if (title && content && category) {

            await Post.query().insert({
                user_id: req.session.user.id,
                category_id: category,
                title: title,
                content: content,
            })
            req.session.flash = {
                type: 'success',
                message: 'Post created successfully!'
            }
            res.redirect(req.headers.referer);
        } else {
            req.session.flash = {
                type: 'warning',
                message: 'You need to choose a title, content and category for your post!'
            }
            res.redirect(req.headers.referer);
        }
    } else {
        req.session.flash = {
            type: 'danger',
            message: 'You need to be signed in before you make a post!'
        }
        res.redirect(req.headers.referer);
    }
})

module.exports = router;