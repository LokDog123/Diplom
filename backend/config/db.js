const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'Diploma';
let db = null;

async function connectDB() {
    const client = new MongoClient(url);
    try {
        console.log('🔍 Подключение к MongoDB...');
        await client.connect();
        console.log('✅ MongoDB подключена');
        
        db = client.db(dbName);
        
        const collections = await db.listCollections().toArray();
        console.log('📚 Коллекции:', collections.map(c => c.name).join(', ') || 'нет');
        
        return db;
    } catch (error) {
        console.error('❌ Ошибка MongoDB:', error.message);
        process.exit(1);
    }
}

function getDB() {
    if (!db) throw new Error('База данных не инициализирована');
    return db;
}

module.exports = { connectDB, getDB };