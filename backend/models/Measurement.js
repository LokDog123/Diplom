const { getDB } = require('../config/db');

class Measurement {
    static collection() {
        return getDB().collection('measurements');
    }

    static async create(measurementData) {
        const { child_id, date, height, weight, head_circumference, notes } = measurementData;
        
        const measurement_id = 'meas_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const measurement = {
            measurement_id,
            child_id,
            date: new Date(date),
            height: parseFloat(height),
            weight: parseFloat(weight),
            head_circumference: head_circumference ? parseFloat(head_circumference) : null,
            notes: notes || '',
            created_at: new Date()
        };
        
        await this.collection().insertOne(measurement);
        return measurement;
    }

    static async findByChild(child_id) {
        return this.collection()
            .find({ child_id })
            .sort({ date: -1 })
            .toArray();
    }

    static async deleteByChild(child_id) {
        return this.collection().deleteMany({ child_id });
    }
}

module.exports = Measurement;