import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './theme.css';  // Добавьте эту строку
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
/*
cd C:\Users\Miroslav\Desktop\Diplom-main\backend
node server.js
cd C:\Users\Miroslav\Desktop\Diplom-main\frontend
npm start
*/