const Child = require('../models/Child');
const Feeding = require('../models/Feeding');
const FoodProduct = require('../models/FoodProduct');
const Health = require('../models/Health');
const Parent = require('../models/Parent');
const Measurement = require('../models/Measurement');
const Vaccination = require('../models/Vaccination');
const WeightAnalytics = require('../models/WeightAnalytics');
const { request } = require('express');

const childController = {
    async create(req, res) {
        try {
            const { parent_id, name, birth_date, gender } = req.body;
            
            if (!parent_id || !name || !birth_date || !gender) {
                return res.status(400).json({ success: false, message: "Все поля обязательны" });
            }

            const child = await Child.create({ parent_id, name, birth_date, gender });
            await Parent.addChild(parent_id, child.child_id);
            
            res.json({ success: true, message: "Ребенок добавлен", child_id: child.child_id });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Ошибка сервера" });
        }
    },

    async getByParent(req, res) {
        try {
            const children = await Child.findByParent(req.params.parent_id);
            res.json({ success: true, children });
        } catch (error) {
            res.status(500).json({ success: false, message: "Ошибка сервера" });
        }
    },

    async getById(req, res) {
        try {
            const child = await Child.findById(req.params.child_id);
            
            if (!child) {
                return res.status(404).json({ success: false, message: "Ребенок не найден" });
            }
            
            res.json({ success: true, child });
            
        } catch (error) {
            res.status(500).json({ success: false, message: "Ошибка сервера" });
        }
    },

    async update(req, res) {
        try {
            const result = await Child.update(req.params.child_id, req.body);
            
            if (result.matchedCount === 0) {
                return res.status(404).json({ success: false, message: "Ребенок не найден" });
            }
            
            res.json({ success: true, message: "Данные обновлены" });
            
        } catch (error) {
            res.status(500).json({ success: false, message: "Ошибка сервера" });
        }
    },

    async delete(req, res) {
        try {
            const child = await Child.findById(req.params.child_id);
            
            if (!child) {
                return res.status(404).json({ success: false, message: "Ребенок не найден" });
            }
            
            // Удаляем все связанные данные (ПРАВИЛЬНЫЙ ПОРЯДОК)
            await Measurement.deleteByChild(req.params.child_id);    // замеры
            await Feeding.deleteByChild(req.params.child_id);       // питание
            await Health.deleteByChild(req.params.child_id);        // здоровье
            await Vaccination.deleteByChild(req.params.child_id);   // прививки
            await WeightAnalytics.deleteByChild(req.params.child_id); // аналитика
            await Parent.removeChild(child.parent_id, req.params.child_id); // удаляем из списка детей родителя
            await Child.delete(req.params.child_id);                 // удаляем самого ребенка
            
            res.json({ success: true, message: "Ребенок и все связанные данные удалены" });
            
        } catch (error) {
            console.error('Ошибка удаления ребенка:', error);
            res.status(500).json({ success: false, message: "Ошибка сервера: " + error.message });
        }
    }
};

module.exports = childController;