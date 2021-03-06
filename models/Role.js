const {
    Model
} = require('objection');

class Role extends Model {

    static tableName = 'roles';

    static get relationMappings() {
        // Importing models here is a one way to avoid require loops.
        const User = require('./User.js');
    
        return {
            user: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: 'roles.id',
                    to: 'users.roleId'
                }
            }
        };
    }


}

module.exports = Role;