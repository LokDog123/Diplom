import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import axios from 'axios';

function AddMeasurement() {
  const { child_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.height || !formData.weight) {
      setError('Рост и вес обязательны для заполнения');
      return;
    }

    if (formData.height <= 0 || formData.weight <= 0) {
      setError('Значения должны быть больше 0');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/measurements', {
        child_id: child_id,
        date: formData.date,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        head_circumference: formData.headCircumference ? parseFloat(formData.headCircumference) : null,
        notes: formData.notes
      });

      if (response.data.success) {
        navigate(`/child/${child_id}`);
      } else {
        setError('Ошибка при сохранении замера');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Ошибка при сохранении замера: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '30px' }}>
        <Link 
          to={`/child/${child_id}`} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            textDecoration: 'none', 
            color: '#7f8c8d',
            marginBottom: '20px'
          }}
        >
          <ArrowLeft size={20} />
          Назад к профилю
        </Link>
        <h1 style={{ fontSize: '28px', color: '#2c3e50' }}>Добавить новый замер</h1>
      </header>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ 
        background: 'white', 
        borderRadius: '20px', 
        padding: '30px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        border: '1px solid #e0e6ed'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '500',
            color: '#2c3e50'
          }}>
            Дата замера <span style={{ color: '#e74c3c' }}>*</span>
          </label>
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
              fontSize: '16px',
              transition: 'border-color 0.3s'
            }}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              Рост (см) <span style={{ color: '#e74c3c' }}>*</span>
            </label>
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
              min="0"
              placeholder="75.5"
              required
            />
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              Вес (кг) <span style={{ color: '#e74c3c' }}>*</span>
            </label>
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
              min="0"
              placeholder="9.2"
              required
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '500',
            color: '#2c3e50'
          }}>
            Окружность головы (см)
          </label>
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
            min="0"
            placeholder="45"
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '500',
            color: '#2c3e50'
          }}>
            Заметки
          </label>
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
              minHeight: '80px',
              resize: 'vertical'
            }}
            placeholder="Особые отметки (необязательно)..."
          />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 30px',
              background: loading ? '#95a5a6' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#2980b9')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#3498db')}
          >
            {loading ? <Loader size={20} className="spin" /> : <Save size={20} />}
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <Link 
            to={`/child/${child_id}`}
            style={{
              padding: '12px 30px',
              background: 'white',
              color: '#7f8c8d',
              textDecoration: 'none',
              borderRadius: '12px',
              border: '2px solid #e0e6ed',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4f8'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
          >
            Отмена
          </Link>
        </div>
      </form>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default AddMeasurement;