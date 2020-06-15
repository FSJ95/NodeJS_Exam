const {
    Model
} = require('objection');

class Point extends Model {

    static tableName = 'points';

    static get relationMappings() {
        // Importing models here is a one way to avoid require loops.
        const User = require('./User.js');
        const Post = require('./Post.js');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'points.userId',
                    to: 'users.id'
                }
            },
            post: {
                relation: Model.BelongsToOneRelation,
                modelClass: Post,
                join: {
                    from: 'posts.postId',
                    to: 'posts.id'
                }
            },
        };
    }



}

module.exports = Point;