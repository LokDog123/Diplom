import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  
  // Временные данные для детей (позже замените на запрос к API)
  const [children, setChildren] = useState([
    { _id: '1', name: 'Анна', birthDate: '2022-05-15', gender: 'female' }
  ]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Функция для расчета возраста
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    return months;
  };

  // Форматирование даты последнего замера (временное)
  const getLastMeasurement = () => {
    const date = new Date();
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Шапка с профилем */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        position: 'relative'
      }}>
        <h1 style={{ fontSize: '32px', color: '#2c3e50' }}>Мои дети</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link 
            to="/add-child" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px'
            }}
          >
            <Plus size={20} />
            Добавить ребенка
          </Link>

          {/* Профиль пользователя */}
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setShowMenu(!showMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 16px',
                background: '#f0f4f8',
                borderRadius: '40px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#3498db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={20} color="white" />
              </div>
              <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                {user?.name || 'Пользователь'}
              </span>
            </div>

            {/* Выпадающее меню */}
            {showMenu && (
              <div style={{
                position: 'absolute',
                top: '60px',
                right: '0',
                width: '250px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                padding: '10px',
                zIndex: 1000
              }}>
                <div style={{
                  padding: '15px',
                  borderBottom: '1px solid #e0e6ed'
                }}>
                  <div style={{ fontWeight: '600', color: '#2c3e50' }}>{user?.name} {user?.lastname}</div>
                  <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '4px' }}>{user?.email}</div>
                </div>
                
                <Link 
                  to="/profile" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 15px',
                    textDecoration: 'none',
                    color: '#2c3e50',
                    borderRadius: '8px',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f5f7fa'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <User size={18} />
                  <span>Мой профиль</span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 15px',
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    color: '#e74c3c',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#fee9e7'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <LogOut size={18} />
                  <span>Выйти</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Список детей */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {children.map(child => (
          <Link 
            to={`/child/${child._id}`} 
            key={child._id} 
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '24px',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '20px', color: '#2c3e50' }}>{child.name}</h3>
              <span style={{ 
                background: '#f0f4f8', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '14px',
                color: '#7f8c8d'
              }}>
                {calculateAge(child.birthDate)} мес
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7f8c8d' }}>
              <User size={16} />
              <span>Последний замер: {getLastMeasurement()}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Если нет детей */}
      {children.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <User size={64} color="#cbd5e0" style={{ marginBottom: '20px' }} />
          <h3 style={{ fontSize: '20px', color: '#2c3e50', marginBottom: '10px' }}>
            У вас пока нет детей
          </h3>
          <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
            Добавьте первого ребенка, чтобы начать отслеживать его развитие
          </p>
          <Link 
            to="/add-child"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 30px',
              background: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px'
            }}
          >
            <Plus size={20} />
            Добавить ребенка
          </Link>
        </div>
      )}

      {/* Затемнение фона при открытом меню */}
      {showMenu && (
        <div 
          onClick={() => setShowMenu(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;