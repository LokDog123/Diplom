import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Baby } from 'lucide-react';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    setLoading(true);
    const success = await register(formData.email, formData.password, formData.name);
    setLoading(false);
    
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e9eef5 100%)'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        padding: '40px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Baby size={48} color="#3498db" style={{ marginBottom: '15px' }} />
          <h1 style={{ fontSize: '24px', color: '#2c3e50', marginBottom: '10px' }}>
            ChildGrowth Tracker
          </h1>
          <p style={{ color: '#7f8c8d' }}>Создайте новый аккаунт</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>Ваше имя</label>
            <input
              type="text"
              name="name"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e6ed',
                borderRadius: '12px',
                fontSize: '16px'
              }}
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Иван Петров"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>Email</label>
            <input
              type="email"
              name="email"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e6ed',
                borderRadius: '12px',
                fontSize: '16px'
              }}
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>Пароль</label>
            <input
              type="password"
              name="password"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e6ed',
                borderRadius: '12px',
                fontSize: '16px'
              }}
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>Подтвердите пароль</label>
            <input
              type="password"
              name="confirmPassword"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e6ed',
                borderRadius: '12px',
                fontSize: '16px'
              }}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '12px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#7f8c8d' }}>
          Уже есть аккаунт? <Link to="/login" style={{ color: '#3498db', textDecoration: 'none' }}>Войти</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;