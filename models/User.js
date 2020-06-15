const {
    Model
} = require('objection');


class User extends Model {

    static tableName = 'users';

    static get relationMappings() {
        // Importing models here is a one way to avoid require loops.
        const Role = require('./Role.js');
        const Post = require('./Post.js');
        const Category = require('./Category.js');
    
        return {
            role: {
                relation: Model.BelongsToOneRelation,
                modelClass: Role,
                join: {
                    from: 'users.roleId',
                    to: 'roles.id'
                }
            },
            post: {
                relation: Model.HasManyRelation,
                modelClass: Post,
                join: {
                    from: 'users.id',
                    to: 'posts.userId'
                }
            },
            category: {
                relation: Model.BelongsToOneRelation,
                modelClass: Category,
                join: {
                    from: 'users.categoryId',
                    to: 'categories.id'
                }
            }
        };
    }

};

module.exports = User;