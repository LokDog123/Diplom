const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const url = 'mongodb://localhost:27017';
const dbName = 'Diploma';

// Функция для проверки подключения к MongoDB
async function testConnection() {
    const client = new MongoClient(url);
    try {
        console.log('🔍 Проверка подключения к MongoDB...');
        await client.connect();
        console.log('✅ Успешное подключение к MongoDB!');
        
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        console.log('📚 Существующие коллекции:', collections.map(c => c.name).join(', ') || 'нет коллекций');
                
        return true;
    } catch (error) {
        console.error('❌ Ошибка подключения к MongoDB:', error.message);
        return false;
    } finally {
        await client.close();
    }
}

// ==================== РЕГИСТРАЦИЯ ====================
app.post('/api/register', async (req, res) => {
    try {
        const { name, lastname, email, password, confirmPassword } = req.body;
        
        if (!name || !lastname || !email || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "Все поля обязательны" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Пароли не совпадают" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Пароль минимум 6 символов" });
        }

        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('parents');
        
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            await client.close();
            return res.status(400).json({ success: false, message: "Email уже зарегистрирован" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const parent_id = 'parent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const parent = {
            parent_id,
            name,
            lastname,
            email,
            password: hashedPassword,
            confirm_password: hashedPassword,
            created_at: new Date()
        };
        
        await collection.insertOne(parent);
        await client.close();
        
        res.json({ success: true, message: "Регистрация успешна!" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
});

// ==================== ВХОД ====================
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email и пароль обязательны" });
        }

        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('parents');
        
        const user = await collection.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            await client.close();
            return res.status(401).json({ success: false, message: "Неверный email или пароль" });
        }
        
        const { password: _, confirm_password: __, ...userWithoutPassword } = user;
        await client.close();
        
        res.json({ success: true, user: userWithoutPassword });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
});

// ==================== ПОЛУЧИТЬ ВСЕХ РОДИТЕЛЕЙ ====================
app.get('/api/parents', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('parents');
        
        const parents = await collection.find({}).toArray();
        await client.close();
        
        const parentsWithoutPasswords = parents.map(({ password, confirm_password, ...rest }) => rest);
        res.json({ success: true, parents: parentsWithoutPasswords });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
});

// ==================== ПОЛУЧИТЬ РОДИТЕЛЯ ПО ID ====================
app.get('/api/parents/:parent_id', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('parents');
        
        const parent = await collection.findOne({ parent_id: req.params.parent_id });
        await client.close();
        
        if (!parent) {
            return res.status(404).json({ success: false, message: 'Родитель не найден' });
        }
        
        const { password, confirm_password, ...parentWithoutPassword } = parent;
        res.json({ success: true, parent: parentWithoutPassword });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
});

// ==================== ОБНОВИТЬ РОДИТЕЛЯ ====================
app.put('/api/parents/:parent_id', async (req, res) => {
    try {
        const { name, lastname, email } = req.body;
        
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('parents');
        
        const result = await collection.updateOne(
            { parent_id: req.params.parent_id },
            { $set: { name, lastname, email, updated_at: new Date() } }
        );
        
        await client.close();
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Родитель не найден' });
        }
        
        res.json({ success: true, message: 'Данные обновлены' });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
});

// ==================== УДАЛИТЬ РОДИТЕЛЯ ====================
app.delete('/api/parents/:parent_id', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('parents');
        
        const result = await collection.deleteOne({ parent_id: req.params.parent_id });
        await client.close();
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Родитель не найден' });
        }
        
        res.json({ success: true, message: 'Родитель удален' });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
});

// ==================== ЗАПУСК СЕРВЕРА ====================
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});