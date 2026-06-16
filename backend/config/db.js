const { MongoClient } = require('mongodb');

// Используем переменную окружения для подключения
const url = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = 'Diploma';
let db = null;
let client = null;

async function connectDB() {
    try {
        console.log('🔍 Подключение к MongoDB...');
        console.log(`📌 Используемый URI: ${url.replace(/\/\/.*@/, '//****:****@')}`); // Скрываем пароль в логах
        
        client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Таймауты для Railway
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        await client.connect();
        console.log('✅ MongoDB подключена успешно!');
        
        db = client.db(dbName);
        
        // Проверяем доступные коллекции
        const collections = await db.listCollections().toArray();
        console.log('📚 Существующие коллекции:', collections.map(c => c.name).join(', ') || 'нет');
        
        return db;
    } catch (error) {
        console.error('❌ Ошибка подключения к MongoDB:', error.message);
        console.error('💡 Убедитесь, что переменная MONGODB_URI или MONGO_URL задана');
        // Не завершаем процесс, чтобы Railway мог перезапустить
        throw error;
    }
}

function getDB() {
    if (!db) {
        throw new Error('База данных не инициализирована. Сначала вызовите connectDB()');
    }
    return db;
}

function getClient() {
    if (!client) {
        throw new Error('Клиент MongoDB не инициализирован. Сначала вызовите connectDB()');
    }
    return client;
}

async function closeDB() {
    if (client) {
        await client.close();
        console.log('🔌 Соединение с MongoDB закрыто');
    }
}

// Автоматическое закрытие при завершении процесса
process.on('SIGINT', async () => {
    console.log('\n⚠️ Получен сигнал SIGINT. Закрываем соединение...');
    await closeDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n⚠️ Получен сигнал SIGTERM. Закрываем соединение...');
    await closeDB();
    process.exit(0);
});

module.exports = { connectDB, getDB, getClient, closeDB };