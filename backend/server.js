const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const url = 'mongodb://localhost:27017';
const dbName = 'Diploma'; 

app.post('/api/register', async (req, res) => {
    try {
        const { name, lastname, email, password, confirmPassword } = req.body;
        
        if (!name || !lastname || !email || !password || !confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required." 
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Passwords do not match." 
            });
        }

        if (!email.includes('@')) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email format." 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: "Password must be at least 6 characters." 
            });
        }
        
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        
        const collection = db.collection('parents');
        
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            await client.close();
            return res.status(400).json({ 
                success: false, 
                message: "This email is already registered." 
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const parent_id = 'parent_' + Date.now() + Math.random().toString(36).substr(2, 9);
        
        const parent = {
            parent_id: parent_id,                    
            name: name,                              
            lastname: lastname,                      
            email: email,                            
            password: hashedPassword,                
            confirm_password: hashedPassword
        };
        
        await client.close();
        
        res.json({ 
            success: true, 
            message: "Registration successful!",
            parent_id: parent_id
        });
        
    } catch (error) {
        console.log('Ошибка:', error);
        
        if (error.code === 121) {
            res.status(400).json({ 
                success: false, 
                message: 'Document failed validation',
                details: error.errInfo
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: "Registration failed: " + error.message 
            });
        }
    }
});

app.listen(5000, () => {
    console.log('Сервер запущен на порту 5000');
});