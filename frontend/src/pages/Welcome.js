import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Baby, LogOut } from 'lucide-react';

function Welcome() {
  const { user, logout } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        padding: '40px',
        background: 'white',
        borderRadius: '30px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          background: '#f0f4f8',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px'
        }}>
          <Baby size={60} color="#667eea" />
        </div>
        
        <h1 style={{ fontSize: '32px', color: '#2c3e50', marginBottom: '20px' }}>
          Добро пожаловать!
        </h1>
        
        <p style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '30px' }}>
          {user ? user.email : 'Гость'}
        </p>
        
        <div style={{ 
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '30px'
        }}>
          <p style={{ color: '#34495e' }}>
            🎉 Вы успешно вошли в систему!
          </p>
          <p style={{ color: '#7f8c8d', marginTop: '10px' }}>
            Здесь будет дашборд с детьми
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link 
            to="/register"
            style={{
              padding: '12px 30px',
              background: '#667eea',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600'
            }}
          >
            Регистрация
          </Link>
          <Link 
            to="/login"
            style={{
              padding: '12px 30px',
              background: '#764ba2',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600'
            }}
          >
            Вход
          </Link>
          <button
            onClick={logout}
            style={{
              padding: '12px 30px',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <LogOut size={18} />
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;