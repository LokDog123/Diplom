const Vaccination = require('../models/Vaccination');
const VaccineScheduleModel = require('../models/VaccineScheduleModel');
const { getDB } = require('../config/db');

class VaccinationService {
    // Убираем static, делаем методы экземпляра
    async getFullSchedule(childId) {
        const db = getDB();
        const child = await db.collection('children').findOne({ child_id: childId });
        
        if (!child) {
            throw new Error('Ребенок не найден');
        }

        // Данные только из БД
        const vaccineSchedule = await VaccineScheduleModel.getAll();
        
        if (!vaccineSchedule || vaccineSchedule.length === 0) {
            throw new Error('Расписание прививок не найдено в базе данных');
        }

        const existingVaccinations = await Vaccination.findByChild(childId);
        const ageMonths = this.calculateAgeInMonths(child.birth_date);
        const ageYears = this.calculateAgeInYears(child.birth_date);

        const fullSchedule = vaccineSchedule.map(vaccine => {
            const existing = existingVaccinations.find(
                v => v.vaccine_name === vaccine.name && v.dose_number === vaccine.dose
            );
            
            const vaccineAgeMonths = vaccine.age_value_in_months;
            const isUpcoming = vaccineAgeMonths > ageMonths && vaccineAgeMonths <= ageMonths + 6;
            const isOverdue = vaccineAgeMonths <= ageMonths && !existing?.is_completed;
            
            return {
                vaccine_name: vaccine.name,
                vaccine_code: vaccine.code,
                scheduled_age: {
                    value: vaccine.age_value,
                    unit: vaccine.age_unit
                },
                scheduled_age_description: this.getAgeDescription(vaccine.age_value, vaccine.age_unit),
                dose_number: vaccine.dose,
                description: vaccine.description,
                status: existing ? (existing.is_completed ? 'completed' : 'scheduled') : 
                       (isOverdue ? 'overdue' : (isUpcoming ? 'upcoming' : 'pending')),
                existing_id: existing?.vaccination_id,
                administered_date: existing?.administered_date,
                batch_number: existing?.batch_number,
                administered_by: existing?.administered_by,
                reaction: existing?.reaction,
                notes: existing?.notes
            };
        });

        const stats = {
            total: fullSchedule.length,
            completed: fullSchedule.filter(v => v.status === 'completed').length,
            upcoming: fullSchedule.filter(v => v.status === 'upcoming').length,
            overdue: fullSchedule.filter(v => v.status === 'overdue').length,
            pending: fullSchedule.filter(v => v.status === 'pending').length,
            completion_rate: Math.round((fullSchedule.filter(v => v.status === 'completed').length / fullSchedule.length) * 100)
        };

        return {
            schedule: fullSchedule,
            stats,
            child_age: {
                months: ageMonths,
                years: ageYears
            }
        };
    }

    async getVaccinationStats(childId) {
        const vaccinations = await Vaccination.findByChild(childId);
        
        const total = vaccinations.length;
        const completed = vaccinations.filter(v => v.is_completed).length;
        const byYear = {};
        const byVaccine = {};
        
        vaccinations.forEach(v => {
            if (v.administered_date) {
                const year = new Date(v.administered_date).getFullYear();
                byYear[year] = (byYear[year] || 0) + 1;
            }
            
            if (v.vaccine_name) {
                byVaccine[v.vaccine_name] = (byVaccine[v.vaccine_name] || 0) + 1;
            }
        });
        
        return {
            total,
            completed,
            pending: total - completed,
            completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
            by_year: byYear,
            by_vaccine: byVaccine
        };
    }

    async getRecommendedVaccines(childId) {
        const db = getDB();
        const child = await db.collection('children').findOne({ child_id: childId });
        
        if (!child) {
            throw new Error('Ребенок не найден');
        }

        const ageMonths = this.calculateAgeInMonths(child.birth_date);
        const existingVaccinations = await Vaccination.findByChild(childId);
        const allVaccines = await VaccineScheduleModel.getAll();
        
        const completedVaccineKeys = new Set(
            existingVaccinations
                .filter(v => v.is_completed)
                .map(v => `${v.vaccine_name}_${v.dose_number}`)
        );
        
        const recommended = allVaccines.filter(vaccine => {
            const key = `${vaccine.name}_${vaccine.dose}`;
            return !completedVaccineKeys.has(key) && vaccine.age_value_in_months <= ageMonths + 6;
        });
        
        return recommended;
    }

    calculateAgeInMonths(birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        return (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    }

    calculateAgeInDays(birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        const diffTime = Math.abs(today - birth);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    calculateAgeInYears(birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    getAgeDescription(age_value, age_unit) {
        switch(age_unit) {
            case 'hours': return `${age_value} часов`;
            case 'days': return `${age_value} дней`;
            case 'months': return `${age_value} мес`;
            case 'years': return `${age_value} лет`;
            default: return `${age_value} ${age_unit}`;
        }
    }
}

// Экспортируем экземпляр класса
module.exports = new VaccinationService();