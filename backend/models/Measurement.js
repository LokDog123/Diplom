const { getDB } = require('../config/db');

class Measurement {
    static collection() {
        return getDB().collection('measurements');
    }

    static async create(measurementData) {
        const { 
            child_id, 
            date, 
            height, 
            weight, 
            head_circumference, 
            notes,
            // Новые поля для питания
            feeding_type,
            food_introduced,
            food_reaction,
            // Новые поля для здоровья
            toilet_count,
            spitup_count,
            temperature,
            medication,
            symptoms
        } = measurementData;
        
        const measurement_id = 'meas_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const measurement = {
            measurement_id,
            child_id,
            date: new Date(date),
            height: height ? parseFloat(height) : null,
            weight: weight ? parseFloat(weight) : null,
            head_circumference: head_circumference ? parseFloat(head_circumference) : null,
            
            // Поля для питания
            feeding_type: feeding_type || null, // 'breast', 'formula', 'puree', 'cereal', 'meat', 'fruit', 'vegetable', 'other'
            food_introduced: food_introduced || null, // название продукта
            food_reaction: food_reaction || null, // 'normal', 'allergy', 'rash', 'diarrhea', 'constipation', 'vomiting'
            
            // Поля для здоровья
            toilet_count: toilet_count ? parseInt(toilet_count) : null, // количество походов в туалет
            spitup_count: spitup_count ? parseInt(spitup_count) : null, // количество срыгиваний
            temperature: temperature ? parseFloat(temperature) : null, // температура тела
            medication: medication || null, // принятые лекарства
            symptoms: symptoms || null, // симптомы
            
            notes: notes || '',
            created_at: new Date(),
            updated_at: new Date()
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

    static async findById(measurement_id) {
        return this.collection().findOne({ measurement_id });
    }

    static async update(measurement_id, updateData) {
        const updateFields = { ...updateData, updated_at: new Date() };
        
        // Преобразование числовых полей
        if (updateFields.height) updateFields.height = parseFloat(updateFields.height);
        if (updateFields.weight) updateFields.weight = parseFloat(updateFields.weight);
        if (updateFields.head_circumference) updateFields.head_circumference = parseFloat(updateFields.head_circumference);
        if (updateFields.toilet_count) updateFields.toilet_count = parseInt(updateFields.toilet_count);
        if (updateFields.spitup_count) updateFields.spitup_count = parseInt(updateFields.spitup_count);
        if (updateFields.temperature) updateFields.temperature = parseFloat(updateFields.temperature);
        
        return this.collection().updateOne(
            { measurement_id },
            { $set: updateFields }
        );
    }

    static async delete(measurement_id) {
        return this.collection().deleteOne({ measurement_id });
    }

    static async deleteByChild(child_id) {
        return this.collection().deleteMany({ child_id });
    }

    // Специализированные методы для получения данных
    static async findFeedingByChild(child_id) {
        return this.collection()
            .find({ 
                child_id,
                $or: [
                    { feeding_type: { $ne: null } },
                    { food_introduced: { $ne: null } }
                ]
            })
            .sort({ date: -1 })
            .toArray();
    }

    static async findHealthByChild(child_id) {
        return this.collection()
            .find({ 
                child_id,
                $or: [
                    { toilet_count: { $ne: null } },
                    { spitup_count: { $ne: null } },
                    { temperature: { $ne: null } },
                    { medication: { $ne: null } },
                    { symptoms: { $ne: null } }
                ]
            })
            .sort({ date: -1 })
            .toArray();
    }

    static async findWeightData(child_id) {
        return this.collection()
            .find({ 
                child_id,
                weight: { $ne: null },
                height: { $ne: null }
            })
            .sort({ date: 1 })
            .toArray();
    }

    static async calculateWeightGain(child_id, days = 7) {
        const measurements = await this.collection()
            .find({ 
                child_id,
                weight: { $ne: null }
            })
            .sort({ date: -1 })
            .limit(2)
            .toArray();

        if (measurements.length < 2) return null;

        const latest = measurements[0];
        const previous = measurements[1];
        
        const daysDiff = Math.abs((new Date(latest.date) - new Date(previous.date)) / (1000 * 60 * 60 * 24));
        const weightDiff = latest.weight - previous.weight;
        
        return {
            daily: (weightDiff / daysDiff).toFixed(2),
            weekly: ((weightDiff / daysDiff) * 7).toFixed(2),
            period: daysDiff
        };
    }

    static async calculateBMI(child_id) {
        const latest = await this.collection()
            .find({ 
                child_id,
                weight: { $ne: null },
                height: { $ne: null }
            })
            .sort({ date: -1 })
            .limit(1)
            .toArray();

        if (latest.length === 0) return null;

        const { weight, height } = latest[0];
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        
        return {
            bmi: parseFloat(bmi),
            date: latest[0].date,
            weight,
            height
        };
    }
}

module.exports = Measurement;