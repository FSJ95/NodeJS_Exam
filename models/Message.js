const {
    Model
} = require('objection');

class Message extends Model {

    static tableName = 'messages';

    static get relationMappings() {
        // Importing models here is a one way to avoid require loops.
        const User = require('./User.js');

        return {
            sender: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: 'messages.senderId',
                    to: 'users.id'
                }
            },
            reciever: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: 'messages.recieverId',
                    to: 'users.id'
                }
            },
        };
    }



}

module.exports = Message;