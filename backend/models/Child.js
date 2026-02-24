const { getDB } = require('../config/db');

class Child {
    static collection() {
        return getDB().collection('children');
    }

    static async create(childData) {
        const { parent_id, name, birth_date, gender } = childData;
        
        const child_id = 'child_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const child = {
            child_id,
            parent_id,
            name,
            birth_date: new Date(birth_date),
            gender,
            created_at: new Date(),
            updated_at: new Date()
        };
        
        await this.collection().insertOne(child);
        return child;
    }

    static async findByParent(parent_id) {
        return this.collection().find({ parent_id }).toArray();
    }

    static async findById(child_id) {
        return this.collection().findOne({ child_id });
    }

    static async update(child_id, data) {
        const { name, birth_date, gender } = data;
        return this.collection().updateOne(
            { child_id },
            { 
                $set: { 
                    name, 
                    birth_date: new Date(birth_date), 
                    gender,
                    updated_at: new Date()
                } 
            }
        );
    }

    static async delete(child_id) {
        return this.collection().deleteOne({ child_id });
    }
}

module.exports = Child;