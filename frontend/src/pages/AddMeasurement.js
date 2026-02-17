import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

function AddMeasurement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    height: '',
    weight: '',
    headCircumference: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Замер добавлен! (тестовая версия)');
    navigate(`/child/${id}`);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '30px' }}>
        <Link to={`/child/${id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#7f8c8d' }}>
          <ArrowLeft size={20} />
          Назад к профилю
        </Link>
        <h1 style={{ marginTop: '20px', fontSize: '28px', color: '#2c3e50' }}>Добавить новый замер</h1>
      </header>

      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Дата замера</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e0e6ed',
              borderRadius: '12px',
              fontSize: '16px'
            }}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Рост (см)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e6ed',
                borderRadius: '12px',
                fontSize: '16px'
              }}
              step="0.1"
              placeholder="75.5"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Вес (кг)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e0e6ed',
                borderRadius: '12px',
                fontSize: '16px'
              }}
              step="0.1"
              placeholder="9.2"
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Окружность головы (см)</label>
          <input
            type="number"
            name="headCircumference"
            value={formData.headCircumference}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e0e6ed',
              borderRadius: '12px',
              fontSize: '16px'
            }}
            step="0.1"
            placeholder="45"
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Заметки</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e0e6ed',
              borderRadius: '12px',
              fontSize: '16px',
              minHeight: '80px'
            }}
            placeholder="Особые отметки..."
          />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 30px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <Save size={20} />
            Сохранить
          </button>
          <Link 
            to={`/child/${id}`}
            style={{
              padding: '12px 30px',
              background: 'white',
              color: '#7f8c8d',
              textDecoration: 'none',
              borderRadius: '12px',
              border: '2px solid #e0e6ed'
            }}
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddMeasurement;