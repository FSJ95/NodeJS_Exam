const router = require('express').Router();

const Post = require('../models/Post.js');
const Point = require('../models/Point.js')

// Fetch all posts.
router.get('/api/posts', async (req, res) => {

    // Had to do 2 calls because of weird bug where category wouldnt get fetched if i added points to the graph join..?
    // Because of this i have to append the points after the fetches.
    const posts = await Post.query().select().withGraphJoined('[category, user]')
        .modifyGraph('user', builder => {
            builder.select('username');
            builder.select('avatar');
        });
    const points = await Point.query().select();

    for (i = 0; i < posts.length; i++) {
        var pointsArray = [];
        var totalPoints = 0;
        for (j = 0; j < points.length; j++) {

            if (posts[i].id == points[j].postId) {
                pointsArray.push(points[j]);
                totalPoints += points[j].points;
            }
        }
        posts[i].points = pointsArray;
        posts[i].totalPoints = totalPoints;
    }

    res.send(posts)
});

// Fetch all posts by username.
router.get('/api/posts/user/:username', async (req, res) => {
    const username = req.params.username
    const posts = await Post.query().select().withGraphJoined('[user, category]')
        .modifyGraph('user', builder => {
            builder.select('username');
            builder.select('avatar');
        }).where('user.username', username);
    const points = await Point.query().select();

    for (i = 0; i < posts.length; i++) {
        var pointsArray = [];
        var totalPoints = 0;
        for (j = 0; j < points.length; j++) {

            if (posts[i].id == points[j].postId) {
                pointsArray.push(points[j]);
                totalPoints += points[j].points;
            }
        }
        posts[i].points = pointsArray;
        posts[i].totalPoints = totalPoints;
    }
    res.send(posts);
});

// Fetch all users favorites.
router.get('/api/posts/favorites', async (req, res) => {
   
    if (req.session.isLoggedIn) {
    

        const posts = await Post.query().select().withGraphJoined('[user, category]')
            .modifyGraph('user', builder => {
                builder.select('username');
                builder.select('avatar');
            });
        const points = await Point.query().select();

        var favorites = [];
        for (i = 0; i < posts.length; i++) {
            var pointsArray = [];
            var totalPoints = 0;
            for (j = 0; j < points.length; j++) {
            
                if (posts[i].id == points[j].postId && points[j].points > 0 && req.session.user.id == points[j].userId) {
                    pointsArray.push(points[j]);
                    totalPoints += points[j].points;
                    favorites.push(posts[i]);
                }
            }
            posts[i].points = pointsArray;
            posts[i].totalPoints = totalPoints;
        }
        res.send(favorites);

    } else {

    }

});

// Fetch all posts by category.
router.get('/api/posts/category/:category', async (req, res) => {
    const category = req.params.category
    const posts = await Post.query().select().withGraphJoined('[user, category]')
        .modifyGraph('user', builder => {
            builder.select('username');
            builder.select('avatar');
        }).where('category', category);
    const points = await Point.query().select();

    for (i = 0; i < posts.length; i++) {
        var pointsArray = [];
        var totalPoints = 0;
        for (j = 0; j < points.length; j++) {

            if (posts[i].id == points[j].postId) {
                pointsArray.push(points[j]);
                totalPoints += points[j].points;
            }
        }
        posts[i].points = pointsArray;
        posts[i].totalPoints = totalPoints;
    }

    res.send(posts);
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

router.post('/api/posts/like/:postID', async (req, res) => {

    const postID = req.params.postID

    if (req.session.isLoggedIn) {

        let didUpdate = await Point.query()
            .patch({
                points: 1,
            }).where('postId', '=', postID).andWhere('userId', '=', req.session.user.id);;

        if (!didUpdate) {
            await Point.query().insert({
                points: 1,
                postId: postID,
                userId: req.session.user.id
            });

        }
    }
})

router.post('/api/posts/unlike/:postID', async (req, res) => {

    const postID = req.params.postID

    if (req.session.isLoggedIn) {

        await Point.query()
            .patch({
                points: 0,
            }).where('postId', '=', postID).andWhere('userId', '=', req.session.user.id);;
    }
})

router.post('/api/posts/dislike/:postID', async (req, res) => {

    const postID = req.params.postID

    if (req.session.isLoggedIn) {

        let didUpdate = await Point.query()
            .patch({
                points: -1,
            }).where('postId', '=', postID).andWhere('userId', '=', req.session.user.id);

        if (!didUpdate) {
            await Point.query().insert({
                points: -1,
                postId: postID,
                userId: req.session.user.id
            });

        }
    }
})

module.exports = router;