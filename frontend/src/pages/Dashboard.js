import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, User } from 'lucide-react';

function Dashboard() {
  // Временные данные
  const children = [
    { _id: '1', name: 'Анна', birthDate: '2022-05-15', gender: 'female' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', color: '#2c3e50' }}>Мои дети</h1>
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
      </header>

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
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '20px', color: '#2c3e50' }}>{child.name}</h3>
              <span style={{ background: '#f0f4f8', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>
                10 мес
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7f8c8d' }}>
              <User size={16} />
              <span>Последний замер: 15.02.2024</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;