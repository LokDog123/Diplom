const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

const url = 'mongodb://localhost:27017';
const dbName = 'Diploma';

// Получить детей родителя
router.get('/parents/:parent_id/children', async (req, res) => {
    try {
        const { parent_id } = req.params;
        console.log('GET /parents/' + parent_id + '/children');
        
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('children');
        
        const children = await collection.find({ parent_id }).toArray();
        await client.close();
        
        res.json({ success: true, children });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
});

// Добавить ребенка
router.post('/children', async (req, res) => {
    try {
        const { parent_id, name, birth_date, gender } = req.body;
        
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        
        const childrenCollection = db.collection('children');
        const child_id = 'child_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const child = {
            child_id,
            parent_id,
            name,
            birth_date: new Date(birth_date),
            gender,
            created_at: new Date()
        };
        
        await childrenCollection.insertOne(child);
        
        const parentsCollection = db.collection('parents');
        await parentsCollection.updateOne(
            { parent_id },
            { $push: { children: child_id } }
        );
        
        await client.close();
        
        res.json({ success: true, message: "Ребенок добавлен" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
});

module.exports = router;