import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Baby } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password, confirmPassword);
    setLoading(false);
    if (success) {
      navigate('/');
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
          <p style={{ color: '#7f8c8d' }}>Войдите в свой аккаунт</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>Email</label>
            <input
              type="email"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e6ed',
                borderRadius: '12px',
                fontSize: '16px'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>Пароль</label>
            <input
              type="password"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e6ed',
                borderRadius: '12px',
                fontSize: '16px'
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>Повторите пароль</label>
            <input
              type="password"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e6ed',
                borderRadius: '12px',
                fontSize: '16px'
              }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#7f8c8d' }}>
          Нет аккаунта? <Link to="/register" style={{ color: '#3498db', textDecoration: 'none' }}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;