const Measurement = require('../models/Measurement');

const measurementController = {
    async create(req, res) {
        try {
            const { 
                child_id, 
                date, 
                height, 
                weight, 
                head_circumference, 
                notes,
                // Поля для питания
                feeding_type,
                food_introduced,
                food_reaction,
                // Поля для здоровья
                toilet_count,
                spitup_count,
                temperature,
                medication,
                symptoms
            } = req.body;
            
            if (!child_id || !date) {
                return res.status(400).json({ 
                    success: false, 
                    message: "ID ребенка и дата обязательны" 
                });
            }

            const measurement = await Measurement.create({
                child_id, 
                date, 
                height, 
                weight, 
                head_circumference, 
                notes,
                feeding_type,
                food_introduced,
                food_reaction,
                toilet_count,
                spitup_count,
                temperature,
                medication,
                symptoms
            });
            
            res.json({ 
                success: true, 
                message: "Замер добавлен", 
                measurement_id: measurement.measurement_id 
            });
            
        } catch (error) {
            console.error('Ошибка создания замера:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getByChild(req, res) {
        try {
            const measurements = await Measurement.findByChild(req.params.child_id);
            res.json({ success: true, measurements });
        } catch (error) {
            console.error('Ошибка получения замеров:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getById(req, res) {
        try {
            const measurement = await Measurement.findById(req.params.measurement_id);
            if (!measurement) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Замер не найден" 
                });
            }
            res.json({ success: true, measurement });
        } catch (error) {
            console.error('Ошибка получения замера:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера" 
            });
        }
    },

    async update(req, res) {
        try {
            const result = await Measurement.update(req.params.measurement_id, req.body);
            
            if (result.matchedCount === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Замер не найден" 
                });
            }
            
            res.json({ 
                success: true, 
                message: "Замер обновлен" 
            });
            
        } catch (error) {
            console.error('Ошибка обновления замера:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера" 
            });
        }
    },

    async delete(req, res) {
        try {
            const result = await Measurement.delete(req.params.measurement_id);
            
            if (result.deletedCount === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Замер не найден" 
                });
            }
            
            res.json({ 
                success: true, 
                message: "Замер удален" 
            });
            
        } catch (error) {
            console.error('Ошибка удаления замера:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера" 
            });
        }
    },

    async getFeedingData(req, res) {
        try {
            const feeding = await Measurement.findFeedingByChild(req.params.child_id);
            res.json({ success: true, feeding });
        } catch (error) {
            console.error('Ошибка получения данных о питании:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера" 
            });
        }
    },

    async getHealthData(req, res) {
        try {
            const health = await Measurement.findHealthByChild(req.params.child_id);
            res.json({ success: true, health });
        } catch (error) {
            console.error('Ошибка получения данных о здоровье:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера" 
            });
        }
    },

    async getWeightAnalytics(req, res) {
        try {
            const weightData = await Measurement.findWeightData(req.params.child_id);
            const weightGain = await Measurement.calculateWeightGain(req.params.child_id);
            const bmi = await Measurement.calculateBMI(req.params.child_id);
            
            res.json({ 
                success: true, 
                weightData,
                weightGain,
                bmi
            });
        } catch (error) {
            console.error('Ошибка получения анализа веса:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера" 
            });
        }
    },

    async createMany(req, res) {
        try {
            const measurements = req.body.measurements;
            if (!Array.isArray(measurements) || measurements.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Необходимо передать массив замеров" 
                });
            }

            const results = [];
            for (const meas of measurements) {
                const measurement = await Measurement.create(meas);
                results.push(measurement);
            }

            res.json({ 
                success: true, 
                message: `Добавлено ${results.length} замеров`,
                count: results.length 
            });
        } catch (error) {
            console.error('Ошибка массового добавления:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера" 
            });
        }
    }
};

module.exports = measurementController;