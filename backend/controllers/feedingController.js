const Feeding = require('../models/Feeding');

const feedingController = {
    async create(req, res) {
        try {
            console.log('📝 Получены данные для питания:', req.body);
            
            const { 
                child_id, 
                date, 
                foodType,        // с фронтенда приходит как foodType
                reaction,
                notes
            } = req.body;
            
            // Валидация
            if (!child_id) {
                return res.status(400).json({ 
                    success: false, 
                    message: "ID ребенка обязателен" 
                });
            }
            
            if (!date) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Дата обязательна" 
                });
            }
            
            if (!foodType) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Тип питания/продукт обязателен" 
                });
            }

            // Определяем тип питания и продукт на основе foodType
            let feeding_type = 'other';
            let food_introduced = foodType;
            
            // Сопоставление с типами из схемы
            const foodTypeMap = {
                'Грудное молоко': 'breast',
                'Смесь': 'formula',
                'Пюре': 'puree',
                'Каша': 'cereal',
                'Мясо': 'meat',
                'Фрукты': 'fruit',
                'Овощи': 'vegetable'
            };
            
            if (foodTypeMap[foodType]) {
                feeding_type = foodTypeMap[foodType];
                food_introduced = foodType;
            }

            // Создаем запись
            const feeding = await Feeding.create({
                child_id, 
                date, 
                feeding_type,
                food_introduced,
                reaction: reaction || 'normal',
                notes
            });
            
            res.status(201).json({ 
                success: true, 
                message: "Запись о питании добавлена", 
                feeding_id: feeding.feeding_id
            });
            
        } catch (error) {
            console.error('❌ Ошибка создания записи о питании:', error);
            
            if (error.code === 121) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Ошибка валидации данных. Проверьте формат полей.",
                    details: error.errInfo
                });
            }
            
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getByChild(req, res) {
        try {
            const { child_id } = req.params;
            
            console.log(`📥 Запрос записей питания для ребенка: ${child_id}`);
            
            const feeding = await Feeding.findByChild(child_id);
            
            console.log(`✅ Найдено ${feeding.length} записей`);
            
            res.json({ 
                success: true, 
                feeding,
                count: feeding.length 
            });
            
        } catch (error) {
            console.error('❌ Ошибка получения записей о питании:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера: " + error.message 
            });
        }
    },

    async getById(req, res) {
        try {
            const feeding = await Feeding.findById(req.params.feeding_id);
            if (!feeding) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Запись не найдена" 
                });
            }
            res.json({ success: true, feeding });
        } catch (error) {
            console.error('❌ Ошибка получения записи:', error);
            res.status(500).json({ 
                success: false, 
                message: "Ошибка сервера" 
            });
        }
    }
};

module.exports = feedingController;