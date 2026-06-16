const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();

// CORS настройки для Railway
app.use(cors({
    origin: '*', // Для демонстрации можно разрешить все
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// ✅ Подключаемся к MongoDB с обработкой ошибок
(async () => {
    try {
        await connectDB();
        console.log('✅ База данных готова к работе');
    } catch (error) {
        console.error('❌ Критическая ошибка при подключении к БД:', error.message);
        // Не останавливаем сервер полностью, но логируем ошибку
    }
})();

// Маршруты
app.use('/api', require('./routes/authRoutes'));
app.use('/api/parents', require('./routes/parentRoutes'));
app.use('/api/children', require('./routes/childRoutes'));
app.use('/api/measurements', require('./routes/measurementRoutes'));
app.use('/api/feeding', require('./routes/feedingRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/weight-analytics', require('./routes/weightAnalyticsRoutes'));
app.use('/api/food-products', require('./routes/foodProductRoutes'));
app.use('/api/vaccinations', require('./routes/vaccinationRoutes'));

// Проверка здоровья сервера
app.get('/api/health', (req, res) => {
    const dbStatus = client && client.isConnected ? 'connected' : 'disconnected';
    res.json({ 
        success: true,
        status: 'OK', 
        message: 'Сервер работает',
        timestamp: new Date(),
        database: dbStatus,
        collections: ['parents', 'children', 'measurements', 'feeding', 'health', 'weight_analytics', 'vaccinations']
    });
});

// Обработка ошибок 404
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Маршрут не найден' 
    });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error('❌ Ошибка сервера:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Внутренняя ошибка сервера',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

// Запускаем сервер
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '='.repeat(50));
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`🔗 Локально: http://localhost:${PORT}`);
    console.log('='.repeat(50));
    console.log('\n📌 Доступные маршруты:');
    console.log('   POST   /api/auth/register');
    console.log('   POST   /api/auth/login');
    console.log('   GET    /api/children');
    console.log('   POST   /api/children');
    console.log('   GET    /api/measurements/child/:child_id');
    console.log('   POST   /api/measurements');
    console.log('   GET    /api/feeding/child/:child_id');
    console.log('   POST   /api/feeding');
    console.log('   GET    /api/health/child/:child_id');
    console.log('   POST   /api/health');
    console.log('   GET    /api/health\n');
});