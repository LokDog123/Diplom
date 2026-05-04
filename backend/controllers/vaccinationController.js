const Vaccination = require('../models/Vaccination');
const { getDB } = require('../config/db');

// Расширенный календарь прививок (полный список до 18 лет)
const vaccineSchedule = [
    // 0-6 месяцев
    { name: 'Гепатит B', code: 'hepatitis_b', age_value: 12, age_unit: 'hours', dose: 1, description: 'Первая вакцинация в роддоме' },
    { name: 'Гепатит B', code: 'hepatitis_b', age_value: 1, age_unit: 'months', dose: 2, description: 'Вторая вакцинация' },
    { name: 'Гепатит B', code: 'hepatitis_b', age_value: 6, age_unit: 'months', dose: 3, description: 'Третья вакцинация' },
    { name: 'Туберкулез (БЦЖ)', code: 'tuberculosis', age_value: 3, age_unit: 'days', dose: 1, description: 'Вакцинация в роддоме' },
    { name: 'Пневмококк', code: 'pneumococcus', age_value: 2, age_unit: 'months', dose: 1, description: 'Первая вакцинация' },
    { name: 'Пневмококк', code: 'pneumococcus', age_value: 4.5, age_unit: 'months', dose: 2, description: 'Вторая вакцинация' },
    { name: 'Пневмококк', code: 'pneumococcus', age_value: 15, age_unit: 'months', dose: 3, description: 'Ревакцинация' },
    { name: 'АКДС (коклюш, дифтерия, столбняк)', code: 'dpt', age_value: 3, age_unit: 'months', dose: 1, description: 'Первая вакцинация' },
    { name: 'АКДС', code: 'dpt', age_value: 4.5, age_unit: 'months', dose: 2, description: 'Вторая вакцинация' },
    { name: 'АКДС', code: 'dpt', age_value: 6, age_unit: 'months', dose: 3, description: 'Третья вакцинация' },
    { name: 'АКДС', code: 'dpt', age_value: 18, age_unit: 'months', dose: 4, description: 'Ревакцинация' },
    { name: 'Полиомиелит', code: 'polio', age_value: 3, age_unit: 'months', dose: 1, description: 'Первая вакцинация (инактивированная)' },
    { name: 'Полиомиелит', code: 'polio', age_value: 4.5, age_unit: 'months', dose: 2, description: 'Вторая вакцинация (инактивированная)' },
    { name: 'Полиомиелит', code: 'polio', age_value: 6, age_unit: 'months', dose: 3, description: 'Третья вакцинация (живая)' },
    { name: 'Полиомиелит', code: 'polio', age_value: 18, age_unit: 'months', dose: 4, description: 'Первая ревакцинация' },
    { name: 'Полиомиелит', code: 'polio', age_value: 7, age_unit: 'years', dose: 5, description: 'Вторая ревакцинация' },
    { name: 'Хиб-инфекция', code: 'dpt_hib', age_value: 3, age_unit: 'months', dose: 1, description: 'Первая вакцинация' },
    { name: 'Хиб-инфекция', code: 'dpt_hib', age_value: 4.5, age_unit: 'months', dose: 2, description: 'Вторая вакцинация' },
    { name: 'Хиб-инфекция', code: 'dpt_hib', age_value: 6, age_unit: 'months', dose: 3, description: 'Третья вакцинация' },
    // 1-6 лет
    { name: 'Корь, краснуха, паротит (MMR)', code: 'mmr', age_value: 12, age_unit: 'months', dose: 1, description: 'Первая вакцинация' },
    { name: 'Корь, краснуха, паротит (MMR)', code: 'mmr', age_value: 6, age_unit: 'years', dose: 2, description: 'Ревакцинация перед школой' },
    { name: 'Ветряная оспа', code: 'chickenpox', age_value: 12, age_unit: 'months', dose: 1, description: 'Первая вакцинация' },
    { name: 'Ветряная оспа', code: 'chickenpox', age_value: 6, age_unit: 'years', dose: 2, description: 'Ревакцинация' },
    // 6-18 лет
    { name: 'Клещевой энцефалит', code: 'encephalitis', age_value: 12, age_unit: 'months', dose: 1, description: 'Первая вакцинация (эндемичные регионы)' },
    { name: 'Клещевой энцефалит', code: 'encephalitis', age_value: 13, age_unit: 'months', dose: 2, description: 'Вторая вакцинация' },
    { name: 'Менингококк', code: 'meningococcus', age_value: 12, age_unit: 'months', dose: 1, description: 'Вакцинация' },
    { name: 'Ротавирус', code: 'rotavirus', age_value: 2, age_unit: 'months', dose: 1, description: 'Первая вакцинация' },
    { name: 'Ротавирус', code: 'rotavirus', age_value: 4, age_unit: 'months', dose: 2, description: 'Вторая вакцинация' },
    { name: 'Гепатит A', code: 'hepatitis_a', age_value: 12, age_unit: 'months', dose: 1, description: 'Первая вакцинация' },
    { name: 'Гепатит A', code: 'hepatitis_a', age_value: 18, age_unit: 'months', dose: 2, description: 'Ревакцинация' },
    { name: 'ВПЧ (рака шейки матки)', code: 'hpv', age_value: 12, age_unit: 'years', dose: 1, description: 'Вакцинация (для девочек)' },
    { name: 'ВПЧ', code: 'hpv', age_value: 13, age_unit: 'years', dose: 2, description: 'Вторая доза' },
    { name: 'АДС-М (дифтерия, столбняк)', code: 'dt', age_value: 7, age_unit: 'years', dose: 1, description: 'Ревакцинация в 7 лет' },
    { name: 'АДС-М', code: 'dt', age_value: 14, age_unit: 'years', dose: 1, description: 'Ревакцинация в 14 лет' },
    { name: 'Грипп', code: 'influenza', age_value: 6, age_unit: 'months', dose: 1, description: 'Ежегодная вакцинация' }
];

function getAgeDescription(age_value, age_unit) {
    if (age_unit === 'hours') return `${age_value} часов`;
    if (age_unit === 'days') return `${age_value} дней`;
    if (age_unit === 'months') return `${age_value} мес`;
    if (age_unit === 'years') return `${age_value} лет`;
    return `${age_value} ${age_unit}`;
}

function calculateAgeInMonths(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    return (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
}

function calculateAgeInYears(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function getAgeValueInMonths(age_value, age_unit) {
    switch(age_unit) {
        case 'hours': return age_value / (24 * 30);
        case 'days': return age_value / 30;
        case 'months': return age_value;
        case 'years': return age_value * 12;
        default: return age_value;
    }
}

const vaccinationController = {
    // Получить полный календарь прививок
    async getSchedule(req, res) {
        try {
            const { child_id } = req.params;
            
            const db = getDB();
            const child = await db.collection('children').findOne({ child_id });
            
            if (!child) {
                return res.status(404).json({ success: false, message: "Ребенок не найден" });
            }
            
            const existingVaccinations = await Vaccination.findByChild(child_id);
            const ageMonths = calculateAgeInMonths(child.birth_date);
            const ageYears = calculateAgeInYears(child.birth_date);
            
            // Все прививки из календаря
            const fullSchedule = vaccineSchedule.map(vaccine => {
                const existing = existingVaccinations.find(
                    v => v.vaccine_name === vaccine.name && v.dose_number === vaccine.dose
                );
                
                const vaccineAgeMonths = getAgeValueInMonths(vaccine.age_value, vaccine.age_unit);
                const isUpcoming = vaccineAgeMonths > ageMonths && vaccineAgeMonths <= ageMonths + 6;
                const isOverdue = vaccineAgeMonths <= ageMonths && !existing?.is_completed;
                
                return {
                    vaccine_name: vaccine.name,
                    vaccine_code: vaccine.code,
                    scheduled_age: {
                        value: vaccine.age_value,
                        unit: vaccine.age_unit
                    },
                    scheduled_age_description: getAgeDescription(vaccine.age_value, vaccine.age_unit),
                    dose_number: vaccine.dose,
                    description: vaccine.description,
                    status: existing ? (existing.is_completed ? 'completed' : 'scheduled') : 
                           (isOverdue ? 'overdue' : (isUpcoming ? 'upcoming' : 'pending')),
                    existing_id: existing?.vaccination_id,
                    administered_date: existing?.administered_date,
                    batch_number: existing?.batch_number,
                    administered_by: existing?.administered_by,
                    reaction: existing?.reaction
                };
            });
            
            // Статистика
            const stats = {
                total: fullSchedule.length,
                completed: fullSchedule.filter(v => v.status === 'completed').length,
                upcoming: fullSchedule.filter(v => v.status === 'upcoming').length,
                overdue: fullSchedule.filter(v => v.status === 'overdue').length,
                pending: fullSchedule.filter(v => v.status === 'pending').length,
                completion_rate: Math.round((fullSchedule.filter(v => v.status === 'completed').length / fullSchedule.length) * 100)
            };
            
            res.json({ 
                success: true, 
                schedule: fullSchedule,
                stats,
                child_age: {
                    months: ageMonths,
                    years: ageYears
                }
            });
        } catch (error) {
            console.error('❌ Ошибка получения календаря:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Получить только предстоящие прививки
    async getUpcoming(req, res) {
        try {
            const { child_id } = req.params;
            const days = req.query.days ? parseInt(req.query.days) : 30;
            
            const upcoming = await Vaccination.getUpcoming(child_id, days);
            res.json({ success: true, upcoming, count: upcoming.length });
        } catch (error) {
            console.error('❌ Ошибка получения предстоящих прививок:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Получить просроченные прививки
    async getOverdue(req, res) {
        try {
            const { child_id } = req.params;
            const overdue = await Vaccination.getOverdue(child_id);
            res.json({ success: true, overdue, count: overdue.length });
        } catch (error) {
            console.error('❌ Ошибка получения просроченных прививок:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Получить все прививки ребенка
    async getByChild(req, res) {
        try {
            const { child_id } = req.params;
            const vaccinations = await Vaccination.findByChild(child_id);
            res.json({ success: true, vaccinations, count: vaccinations.length });
        } catch (error) {
            console.error('❌ Ошибка получения прививок:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Получить статистику по прививкам
    async getStats(req, res) {
        try {
            const { child_id } = req.params;
            const vaccinations = await Vaccination.findByChild(child_id);
            
            const total = vaccinations.length;
            const completed = vaccinations.filter(v => v.is_completed).length;
            const byYear = {};
            
            vaccinations.forEach(v => {
                if (v.administered_date) {
                    const year = new Date(v.administered_date).getFullYear();
                    byYear[year] = (byYear[year] || 0) + 1;
                }
            });
            
            res.json({
                success: true,
                stats: {
                    total,
                    completed,
                    pending: total - completed,
                    completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
                    by_year: byYear
                }
            });
        } catch (error) {
            console.error('❌ Ошибка получения статистики:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Создать запись о прививке
    async create(req, res) {
        try {
            console.log('📝 Создание прививки с данными:', req.body);
            
            const { child_id, vaccine_name, administered_date, dose_number, batch_number, administered_by, reaction, notes } = req.body;
            
            if (!child_id) {
                return res.status(400).json({ success: false, message: "ID ребенка обязателен" });
            }
            if (!vaccine_name) {
                return res.status(400).json({ success: false, message: "Название прививки обязательно" });
            }
            
            const vaccination = await Vaccination.create({
                child_id,
                vaccine_name,
                administered_date: administered_date || null,
                dose_number: dose_number || 1,
                batch_number: batch_number || null,
                administered_by: administered_by || null,
                reaction: reaction || null,
                notes: notes || null,
                is_completed: !!administered_date
            });
            
            res.status(201).json({ success: true, message: "Прививка добавлена", vaccination });
        } catch (error) {
            console.error('❌ Ошибка создания прививки:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Обновить прививку
    async update(req, res) {
        try {
            const { vaccination_id } = req.params;
            const updateData = req.body;
            
            const result = await Vaccination.update(vaccination_id, updateData);
            
            if (result.matchedCount === 0) {
                return res.status(404).json({ success: false, message: "Прививка не найдена" });
            }
            
            res.json({ success: true, message: "Прививка обновлена" });
        } catch (error) {
            console.error('❌ Ошибка обновления прививки:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Отметить прививку как выполненную
    async markAsCompleted(req, res) {
        try {
            const { vaccination_id } = req.params;
            const { administered_date, batch_number, administered_by, reaction, notes } = req.body;
            
            const result = await Vaccination.update(vaccination_id, {
                is_completed: true,
                administered_date: administered_date ? new Date(administered_date) : new Date(),
                batch_number: batch_number || null,
                administered_by: administered_by || null,
                reaction: reaction || null,
                notes: notes || null
            });
            
            if (result.matchedCount === 0) {
                return res.status(404).json({ success: false, message: "Прививка не найдена" });
            }
            
            res.json({ success: true, message: "Прививка отмечена как выполненная" });
        } catch (error) {
            console.error('❌ Ошибка отметки прививки:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Удалить прививку
    async delete(req, res) {
        try {
            const { vaccination_id } = req.params;
            const result = await Vaccination.delete(vaccination_id);
            
            if (result.deletedCount === 0) {
                return res.status(404).json({ success: false, message: "Прививка не найдена" });
            }
            
            res.json({ success: true, message: "Прививка удалена" });
        } catch (error) {
            console.error('❌ Ошибка удаления прививки:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = vaccinationController;