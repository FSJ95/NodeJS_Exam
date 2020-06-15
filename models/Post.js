const {
    Model
} = require('objection');

class Post extends Model {

    static tableName = 'posts';

    static get relationMappings() {
        // Importing models here is a one way to avoid require loops.
        const User = require('./User.js');
        const Category = require('./Category.js');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'posts.userId',
                    to: 'users.id'
                }
            },
            category: {
                relation: Model.BelongsToOneRelation,
                modelClass: Category,
                join: {
                    from: 'posts.categoryID',
                    to: 'categories.id'
                }
            },
        };
    }



}

module.exports = Post;