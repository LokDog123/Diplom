const { getDB } = require('../config/db');
const bcrypt = require('bcrypt');

class Parent {
    static collection() {
        return getDB().collection('parents');
    }

    static async create(parentData) {
        const { name, lastname, email, password, phone, birth_date } = parentData;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const parent_id = 'parent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const parent = {
            parent_id,
            name,
            lastname,
            email,
            phone: phone || '',
            birth_date: birth_date ? new Date(birth_date) : null,
            password: hashedPassword,
            confirm_password: hashedPassword,
            children: []
        };
        
        await this.collection().insertOne(parent);
        return parent;
    }

    static async findByEmail(email) {
        return this.collection().findOne({ email });
    }

    static async findById(parent_id) {
        return this.collection().findOne({ parent_id });
    }

    static async update(parent_id, data) {
        const { name, lastname, email, phone, birth_date } = data;
        return this.collection().updateOne(
            { parent_id },
            { $set: { 
                name, 
                lastname, 
                email, 
                phone: phone || '',
                birth_date: birth_date ? new Date(birth_date) : null
            } }
        );
    }

    static async addChild(parent_id, child_id) {
        return this.collection().updateOne(
            { parent_id },
            { $push: { children: child_id } }
        );
    }

    static async removeChild(parent_id, child_id) {
        return this.collection().updateOne(
            { parent_id },
            { $pull: { children: child_id } }
        );
    }
}

module.exports = Parent;