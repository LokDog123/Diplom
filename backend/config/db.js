const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'Diploma';
let db = null;
let client = null;

async function connectDB() {
    try {
        console.log('🔍 Подключение к MongoDB...');
        client = new MongoClient(url);
        await client.connect();
        console.log('✅ MongoDB подключена');
        
        db = client.db(dbName);
        
        // Проверяем существующие коллекции
        const collections = await db.listCollections().toArray();
        console.log('📚 Существующие коллекции:', collections.map(c => c.name).join(', ') || 'нет');
        
        return db;
    } catch (error) {
        console.error('❌ Ошибка MongoDB:', error.message);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error('База данных не инициализирована. Сначала вызовите connectDB()');
    }
    return db;
}

async function closeDB() {
    if (client) {
        await client.close();
        console.log('🔌 Соединение с MongoDB закрыто');
    }
}

module.exports = { connectDB, getDB, closeDB };