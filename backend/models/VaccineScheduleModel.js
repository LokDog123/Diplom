const { getDB } = require('../config/db');
const fs = require('fs');
const path = require('path');

const VaccineScheduleModel = {
    async getAll() {
        const db = getDB();
        // Исправлено: vaccine_schedule (как в других методах)
        return await db.collection('vaccine_schedule')
            .find({ is_active: true })
            .sort({ age_value_in_months: 1, dose: 1 })
            .toArray();
    },

    async getByCodeAndDose(code, dose) {
        const db = getDB();
        return await db.collection('vaccine_schedule')
            .findOne({ code, dose, is_active: true });
    },

    async getByCode(code) {
        const db = getDB();
        return await db.collection('vaccine_schedule')
            .find({ code, is_active: true })
            .sort({ dose: 1 })
            .toArray();
    },

    async getByAge(ageInMonths) {
        const db = getDB();
        return await db.collection('vaccine_schedule')
            .find({ 
                age_value_in_months: { $lte: ageInMonths },
                is_active: true 
            })
            .sort({ age_value_in_months: 1 })
            .toArray();
    },

    async getUpcomingVaccines(ageInMonths, lookaheadMonths = 6) {
        const db = getDB();
        return await db.collection('vaccine_schedule')
            .find({ 
                age_value_in_months: { $gt: ageInMonths, $lte: ageInMonths + lookaheadMonths },
                is_active: true 
            })
            .sort({ age_value_in_months: 1 })
            .toArray();
    },

    async getOverdueVaccines(ageInMonths) {
        const db = getDB();
        return await db.collection('vaccine_schedule')
            .find({ 
                age_value_in_months: { $lte: ageInMonths },
                is_active: true 
            })
            .sort({ age_value_in_months: 1 })
            .toArray();
    },

    async isEmpty() {
        const db = getDB();
        const count = await db.collection('vaccine_schedule').countDocuments();
        return count === 0;
    },

    async getCount() {
        const db = getDB();
        return await db.collection('vaccine_schedule').countDocuments({ is_active: true });
    },

    // Остальные методы без изменений...
    async seed() {
        const db = getDB();
        
        const existingCount = await db.collection('vaccine_schedule').countDocuments();
        
        if (existingCount > 0) {
            console.log(`📊 Данные уже существуют в БД. Найдено записей: ${existingCount}`);
            return { 
                success: true, 
                message: 'Данные уже загружены', 
                count: existingCount,
                isNew: false 
            };
        }
        
        const vaccineScheduleData = await this.loadVaccineDataFromFile();
        
        if (!vaccineScheduleData || vaccineScheduleData.length === 0) {
            throw new Error('Не удалось загрузить данные о прививках. Проверьте файл vaccine_schedule.json');
        }
        
        const result = await db.collection('vaccine_schedule').insertMany(vaccineScheduleData);
        
        await db.collection('vaccine_schedule').createIndex(
            { code: 1, dose: 1 }, 
            { unique: true }
        );
        await db.collection('vaccine_schedule').createIndex({ age_value_in_months: 1 });
        await db.collection('vaccine_schedule').createIndex({ code: 1 });
        await db.collection('vaccine_schedule').createIndex({ is_active: 1 });
        
        console.log(`✅ Календарь прививок загружен в БД. Добавлено записей: ${result.insertedCount}`);
        
        return { 
            success: true, 
            message: 'Данные успешно загружены', 
            count: result.insertedCount,
            isNew: true 
        };
    },

    async loadVaccineDataFromFile() {
        try {
            const possiblePaths = [
                path.join(process.cwd(), 'data', 'vaccine_schedule.json'),
                path.join(process.cwd(), 'vaccine_schedule.json'),
                path.join(__dirname, '../data/vaccine_schedule.json'),
                path.join(__dirname, 'vaccine_schedule.json')
            ];
            
            for (const filePath of possiblePaths) {
                if (fs.existsSync(filePath)) {
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    console.log(`📁 Данные загружены из файла: ${filePath}`);
                    return data;
                }
            }
            
            console.error(`❌ Файл vaccine_schedule.json не найден ни в одной из папок`);
            return null;
        } catch (error) {
            console.error('❌ Ошибка загрузки JSON файла:', error.message);
            return null;
        }
    },

    async refreshFromJsonFile() {
        const db = getDB();
        
        const vaccineScheduleData = await this.loadVaccineDataFromFile();
        
        if (!vaccineScheduleData || vaccineScheduleData.length === 0) {
            throw new Error('Не удалось загрузить данные из JSON файла');
        }
        
        await db.collection('vaccine_schedule').deleteMany({});
        const result = await db.collection('vaccine_schedule').insertMany(vaccineScheduleData);
        
        console.log(`🔄 Данные обновлены из JSON файла. Добавлено записей: ${result.insertedCount}`);
        
        return { 
            success: true, 
            message: 'Данные успешно обновлены', 
            count: result.insertedCount 
        };
    },

    async updateVaccineData(vaccineId, updateData) {
        const db = getDB();
        const { ObjectId } = require('mongodb');
        
        const result = await db.collection('vaccine_schedule')
            .updateOne(
                { _id: new ObjectId(vaccineId) },
                { $set: { ...updateData, updated_at: new Date() } }
            );
        
        return result;
    },

    async addVaccine(vaccineData) {
        const db = getDB();
        
        const result = await db.collection('vaccine_schedule').insertOne({
            ...vaccineData,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        });
        
        return result;
    },

    async deleteVaccine(vaccineId) {
        const db = getDB();
        const { ObjectId } = require('mongodb');
        
        const result = await db.collection('vaccine_schedule')
            .deleteOne({ _id: new ObjectId(vaccineId) });
        
        return result;
    }
};

module.exports = VaccineScheduleModel;