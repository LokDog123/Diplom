const Vaccination = require('../models/Vaccination');
const vaccinationService = require('../services/vaccinationService');

const vaccinationController = {
    async getSchedule(req, res) {
        try {
            const { child_id } = req.params;
            const result = await vaccinationService.getFullSchedule(child_id);
            res.json({ success: true, ...result });
        } catch (error) {
            console.error('❌ Ошибка получения календаря:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

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

    async getStats(req, res) {
        try {
            const { child_id } = req.params;
            const stats = await vaccinationService.getVaccinationStats(child_id);
            res.json({ success: true, stats });
        } catch (error) {
            console.error('❌ Ошибка получения статистики:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

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
            
            res.status(201).json({ 
                success: true, 
                message: "Прививка добавлена", 
                vaccination 
            });
        } catch (error) {
            console.error('❌ Ошибка создания прививки:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

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