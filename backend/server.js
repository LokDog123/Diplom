const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Инициализация приложения
const app = express();
app.use(cors());
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Подключение к БД
connectDB();

// Маршруты
app.use('/api', require('./routes/authRoutes'));
app.use('/api/parents', require('./routes/parentRoutes'));
app.use('/api/children', require('./routes/childRoutes'));
app.use('/api/measurements', require('./routes/measurementRoutes'));

// Проверка здоровья
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Сервер работает' });
});

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log('='.repeat(50) + '\n');
});