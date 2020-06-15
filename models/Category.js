const {
    Model
} = require('objection');

class Category extends Model {

    static tableName = 'categories';

    static get relationMappings() {
        // Importing models here is a one way to avoid require loops.
        const User = require('./User.js');

        return {
            user: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: 'categories.id',
                    to: 'users.categoryId'
                }
            }
        };
    }
}

module.exports = Category;