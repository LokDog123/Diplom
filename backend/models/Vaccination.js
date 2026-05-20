const { getDB } = require('../config/db');

class Vaccination {
    static collection() {
        return getDB().collection('vaccinations');
    }

    static async create(vaccinationData) {
        try {
            const { 
                child_id, 
                vaccine_name, 
                vaccine_code,
                administered_date,
                dose_number,
                batch_number,
                administered_by,
                reaction,
                notes,
                is_completed
            } = vaccinationData;
            
            const vaccination_id = 'vac_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            const vaccination = {
                vaccination_id,
                child_id,
                vaccine_name,
                vaccine_code: vaccine_code || 'other',
                administered_date: administered_date ? new Date(administered_date) : null,
                dose_number: dose_number || 1,
                batch_number: batch_number || null,
                administered_by: administered_by || null,
                reaction: reaction || null,
                notes: notes || null,
                is_completed: is_completed || false,
                created_at: new Date(),
                updated_at: new Date()
            };
            
            const result = await this.collection().insertOne(vaccination);
            return vaccination;
        } catch (error) {
            console.error('❌ Ошибка создания прививки:', error);
            throw error;
        }
    }

    static async findByChild(child_id) {
        try {
            return await this.collection()
                .find({ child_id })
                .sort({ administered_date: -1, created_at: -1 })
                .toArray();
        } catch (error) {
            console.error('❌ Ошибка поиска прививок:', error);
            return [];
        }
    }

    static async findById(vaccination_id) {
        try {
            return await this.collection().findOne({ vaccination_id });
        } catch (error) {
            console.error('❌ Ошибка поиска прививки:', error);
            return null;
        }
    }

    static async getUpcoming(child_id, daysAhead = 30) {
        try {
            const today = new Date();
            const future = new Date();
            future.setDate(today.getDate() + daysAhead);
            
            return await this.collection()
                .find({
                    child_id,
                    is_completed: false,
                    scheduled_date: { $gte: today, $lte: future }
                })
                .sort({ scheduled_date: 1 })
                .toArray();
        } catch (error) {
            console.error('❌ Ошибка получения предстоящих прививок:', error);
            return [];
        }
    }

    static async getOverdue(child_id) {
        try {
            const today = new Date();
            
            return await this.collection()
                .find({
                    child_id,
                    is_completed: false,
                    scheduled_date: { $lt: today }
                })
                .sort({ scheduled_date: 1 })
                .toArray();
        } catch (error) {
            console.error('❌ Ошибка получения просроченных прививок:', error);
            return [];
        }
    }

    static async update(vaccination_id, updateData) {
        try {
            const updateFields = {
                ...updateData,
                updated_at: new Date()
            };
            
            if (updateFields.scheduled_date) {
                updateFields.scheduled_date = new Date(updateFields.scheduled_date);
            }
            if (updateFields.administered_date) {
                updateFields.administered_date = new Date(updateFields.administered_date);
            }
            
            const result = await this.collection().updateOne(
                { vaccination_id },
                { $set: updateFields }
            );
            
            return result;
        } catch (error) {
            console.error('❌ Ошибка обновления прививки:', error);
            throw error;
        }
    }

    static async delete(vaccination_id) {
        try {
            const result = await this.collection().deleteOne({ vaccination_id });
            return result;
        } catch (error) {
            console.error('❌ Ошибка удаления прививки:', error);
            throw error;
        }
    }

    static async deleteByChild(child_id) {
        try {
            const result = await this.collection().deleteMany({ child_id: String(child_id) });
            console.log(`✅ Удалено ${result.deletedCount} прививок для ребенка ${child_id}`);
            return result;
        } catch (error) {
            console.error('❌ Ошибка в Vaccination.deleteByChild:', error);
            throw error;
        }
    }
}

module.exports = Vaccination;