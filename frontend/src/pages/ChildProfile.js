import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

function ChildProfile() {
  const { id } = useParams();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#7f8c8d' }}>
            <ArrowLeft size={20} />
            Назад
          </Link>
          <div>
            <h1 style={{ fontSize: '28px', color: '#2c3e50' }}>Анна</h1>
            <div style={{ display: 'flex', gap: '20px', color: '#7f8c8d' }}>
              <span>Пол: Женский</span>
              <span>Дата рождения: 15.05.2022</span>
            </div>
          </div>
        </div>
        <Link 
          to={`/child/${id}/add-measurement`}
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
          Добавить замер
        </Link>
      </header>

      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Здесь будут графики роста</h2>
        <p style={{ color: '#7f8c8d' }}>Добавьте первый замер, чтобы увидеть динамику</p>
      </div>
    </div>
  );
}

export default ChildProfile;