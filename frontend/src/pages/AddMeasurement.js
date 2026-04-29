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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.height || !formData.weight) {
      setError('Рост и вес обязательны');
      return;
    }

    if (formData.height <= 0 || formData.weight <= 0) {
      setError('Значения должны быть больше 0');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/measurements', {
        child_id,
        date: formData.date,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        head_circumference: formData.headCircumference
          ? parseFloat(formData.headCircumference)
          : null,
        notes: formData.notes
      });

      if (res.data.success) {
        navigate(`/child/${child_id}`);
      } else {
        setError('Ошибка сохранения');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <Link to={`/child/${child_id}`} style={styles.back}>
            <ArrowLeft size={20} />
            Назад
          </Link>

          <h1 style={styles.title}>Добавить замер</h1>
        </div>

        {/* ERROR */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} style={styles.card}>

          <div style={styles.field}>
            <label style={styles.label}>Дата *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Рост (см) *</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                style={styles.input}
                placeholder="75.5"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Вес (кг) *</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                style={styles.input}
                placeholder="9.2"
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Окружность головы</label>
            <input
              type="number"
              name="headCircumference"
              value={formData.headCircumference}
              onChange={handleChange}
              style={styles.input}
              placeholder="45"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Заметки</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={{ ...styles.input, minHeight: '90px', resize: 'vertical' }}
              placeholder="Необязательно..."
            />
          </div>

          <div style={styles.actions}>
            <button type="submit" disabled={loading} style={styles.primaryBtn}>
              {loading ? <Loader size={18} className="spin" /> : <Save size={18} />}
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>

            <Link to={`/child/${child_id}`} style={styles.secondaryBtn}>
              Отмена
            </Link>
          </div>
        </form>
      </div>

      <style>{`
        * { box-sizing: border-box; }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* СТИЛИ - только светлая тема */
const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f7fa',
    padding: '40px 20px'
  },

  container: {
    maxWidth: '800px',
    margin: '0 auto'
  },

  header: {
    marginBottom: '30px'
  },

  back: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    color: '#64748b',
    marginBottom: '15px'
  },

  title: {
    fontSize: '28px',
    color: '#1e293b'
  },

  error: {
    background: '#fee2e2',
    color: '#ef4444',
    border: '1px solid #ef4444',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '20px'
  },

  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
  },

  field: {
    marginBottom: '20px'
  },

  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#475569'
  },

  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    background: '#ffffff',
    color: '#1e293b',
    fontSize: '16px',
    outline: 'none'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },

  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px'
  },

  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer'
  },

  secondaryBtn: {
    padding: '12px 20px',
    background: '#f1f5f9',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    textDecoration: 'none'
  }
};

export default AddMeasurement;