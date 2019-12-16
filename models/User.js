'use strict';

const {hashString, db} = require('../utils');
const {dbUrl, dbName} = require('../config');

class User {
    constructor(email) {
        this.data = {
            email: email,
            hash: hashString(email, 'md5')
        };
    }

    get getData() {
        return this.data;
    }

    async save() {
        try { 
            const client = await db(dbUrl);
            const database = client.db(dbName);
            const users = database.collection('users');
            const existingUser = await users.findOne({email: this.data.email});
            
            if(!existingUser) {
                await users.insertOne(this.data);
                return this.data;
            }
            
        } catch(err) {
            return {
                error: 'Failed to save to database.'
            }
        }
    }
}

module.exports = User;