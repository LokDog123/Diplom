const Vaccination = require('../models/Vaccination');
const Child = require('../models/Child');

class VaccinationService {
    // Получить все прививки ребенка
    async getByChild(child_id) {
        return await Vaccination.findByChild(child_id);
    }

    // Получить календарь прививок
    async getSchedule(child_id) {
        const child = await Child.findByPk(child_id);
        if (!child) {
            throw new Error('Ребенок не найден');
        }

        const birthDate = new Date(child.birth_date);
        const today = new Date();
        const ageMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                          (today.getMonth() - birthDate.getMonth());

        // Календарь прививок по возрасту
        const scheduleTemplate = [
            { vaccine_name: 'БЦЖ (туберкулез)', dose_number: 1, scheduled_age_months: 0, scheduled_age_description: 'в роддоме' },
            { vaccine_name: 'Гепатит В', dose_number: 1, scheduled_age_months: 0, scheduled_age_description: 'в роддоме' },
            { vaccine_name: 'Гепатит В', dose_number: 2, scheduled_age_months: 1, scheduled_age_description: '1 месяц' },
            { vaccine_name: 'АКДС (коклюш, дифтерия, столбняк)', dose_number: 1, scheduled_age_months: 3, scheduled_age_description: '3 месяца' },
            { vaccine_name: 'Полиомиелит', dose_number: 1, scheduled_age_months: 3, scheduled_age_description: '3 месяца' },
            { vaccine_name: 'АКДС', dose_number: 2, scheduled_age_months: 4.5, scheduled_age_description: '4.5 месяца' },
            { vaccine_name: 'Полиомиелит', dose_number: 2, scheduled_age_months: 4.5, scheduled_age_description: '4.5 месяца' },
            { vaccine_name: 'АКДС', dose_number: 3, scheduled_age_months: 6, scheduled_age_description: '6 месяцев' },
            { vaccine_name: 'Полиомиелит', dose_number: 3, scheduled_age_months: 6, scheduled_age_description: '6 месяцев' },
            { vaccine_name: 'Гепатит В', dose_number: 3, scheduled_age_months: 6, scheduled_age_description: '6 месяцев' },
            { vaccine_name: 'Корь, краснуха, паротит (КПК)', dose_number: 1, scheduled_age_months: 12, scheduled_age_description: '12 месяцев' },
            { vaccine_name: 'АКДС (ревакцинация)', dose_number: 4, scheduled_age_months: 18, scheduled_age_description: '18 месяцев' },
            { vaccine_name: 'Полиомиелит (ревакцинация)', dose_number: 4, scheduled_age_months: 18, scheduled_age_description: '18 месяцев' },
            { vaccine_name: 'КПК (ревакцинация)', dose_number: 2, scheduled_age_months: 72, scheduled_age_description: '6 лет' }
        ];

        // Получаем сделанные прививки
        const completedVaccinations = await Vaccination.findByChild(child_id);
        const completedMap = new Map();
        
        completedVaccinations.forEach(vac => {
            const key = `${vac.vaccine_name}_${vac.dose_number}`;
            completedMap.set(key, vac);
        });

        // Формируем расписание со статусами
        const schedule = scheduleTemplate.map(vaccine => {
            const key = `${vaccine.vaccine_name}_${vaccine.dose_number}`;
            const completed = completedMap.get(key);
            
            let status = 'pending';
            if (completed) {
                status = 'completed';
            } else if (vaccine.scheduled_age_months <= ageMonths) {
                status = 'overdue';
            } else if (vaccine.scheduled_age_months - ageMonths <= 1) {
                status = 'upcoming';
            }
            
            return {
                ...vaccine,
                status,
                completed_date: completed ? completed.administered_date : null,
                reaction: completed ? completed.reaction : null,
                vaccination_id: completed ? completed.vaccination_id : null
            };
        });

        // Статистика
        const stats = {
            completed: schedule.filter(v => v.status === 'completed').length,
            upcoming: schedule.filter(v => v.status === 'upcoming').length,
            overdue: schedule.filter(v => v.status === 'overdue').length,
            completion_rate: schedule.length > 0 
                ? Math.round((schedule.filter(v => v.status === 'completed').length / schedule.length) * 100)
                : 0
        };

        return { schedule, stats };
    }

    // Создать прививку
    async create(data) {
        return await Vaccination.create(data);
    }

    // Обновить прививку
    async update(vaccination_id, data) {
        return await Vaccination.update(vaccination_id, data);
    }

    // Удалить прививку
    async delete(vaccination_id) {
        return await Vaccination.delete(vaccination_id);
    }
}

module.exports = new VaccinationService();