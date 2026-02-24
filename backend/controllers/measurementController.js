const Measurement = require('../models/Measurement');

const measurementController = {
    async create(req, res) {
        try {
            const { child_id, date, height, weight, head_circumference, notes } = req.body;
            
            if (!child_id || !date || !height || !weight) {
                return res.status(400).json({ success: false, message: "Заполните обязательные поля" });
            }

            const measurement = await Measurement.create({
                child_id, date, height, weight, head_circumference, notes
            });
            
            res.json({ success: true, message: "Замер добавлен", measurement_id: measurement.measurement_id });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Ошибка сервера" });
        }
    },

    async getByChild(req, res) {
        try {
            const measurements = await Measurement.findByChild(req.params.child_id);
            res.json({ success: true, measurements });
        } catch (error) {
            res.status(500).json({ success: false, message: "Ошибка сервера" });
        }
    }
};

module.exports = measurementController;