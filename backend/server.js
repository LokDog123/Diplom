const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

connectDB();

app.use('/api', require('./routes/authRoutes'));
app.use('/api/parents', require('./routes/parentRoutes'));
app.use('/api/children', require('./routes/childRoutes'));
app.use('/api/measurements', require('./routes/measurementRoutes'));

app.use('/api/feeding', require('./routes/feedingRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/weight-analytics', require('./routes/weightAnalyticsRoutes'));

app.get('/api/health', (req, res) => {
    res.json({ 
        success: true,
        status: 'OK', 
        message: 'Сервер работает',
        timestamp: new Date(),
        collections: ['parents', 'children', 'measurements', 'feeding', 'health', 'weight_analytics']
    });
});

app.use((err, req, res, next) => {
    console.error('❌ Ошибка сервера:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Внутренняя ошибка сервера' 
    });
});

app.use('/api/food-products', require('./routes/foodProductRoutes'));

const vaccinationRoutes = require('./routes/vaccinationRoutes');
app.use('/api/vaccinations', vaccinationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log('='.repeat(50));
    console.log('\n📌 Доступные маршруты:');
    console.log('   POST   /api/feeding');
    console.log('   GET    /api/feeding/child/:child_id');
    console.log('   POST   /api/health');
    console.log('   GET    /api/health/child/:child_id');
    console.log('   POST   /api/weight-analytics');
    console.log('   GET    /api/weight-analytics/child/:child_id');
    console.log('   POST   /api/weight-analytics/child/:child_id/calculate');
    console.log('   GET    /api/health\n');
    
});
