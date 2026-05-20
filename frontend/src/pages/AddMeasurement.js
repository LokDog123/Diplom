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
        
        if (!formData.height || !formData.weight) {
            setError('Заполните рост и вес');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const payload = {
                child_id: child_id,
                date: formData.date,
                height: parseFloat(formData.height),
                weight: parseFloat(formData.weight),
                head_circumference: formData.headCircumference ? parseFloat(formData.headCircumference) : null,
                notes: formData.notes || null
            };
            
            const response = await axios.post('http://localhost:5000/api/measurements', payload);
            
            if (response.status === 200 || response.status === 201 || response.data.success) {
                navigate(`/child/${child_id}`);
            } else {
                setError('Ошибка при сохранении');
            }
        } catch (err) {
            console.error('Ошибка:', err);
            setError(err.response?.data?.message || 'Ошибка сервера');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f7fa',
            padding: '40px 20px'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <Link 
                    to={`/child/${child_id}`} 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        color: '#64748b',
                        marginBottom: '15px'
                    }}
                >
                    <ArrowLeft size={20} />
                    Назад
                </Link>
                
                <h1 style={{
                    fontSize: '28px',
                    color: '#1e293b',
                    marginBottom: '20px'
                }}>Добавить замер</h1>

                {error && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        padding: '12px',
                        borderRadius: '10px',
                        marginBottom: '20px'
                    }}>
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    padding: '30px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#475569' }}>
                            Дата <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '2px solid #e2e8f0',
                                fontSize: '16px'
                            }}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#475569' }}>
                                Рост (см) <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #e2e8f0',
                                    fontSize: '16px'
                                }}
                                step="0.1"
                                placeholder="75.5"
                                required
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#475569' }}>
                                Вес (кг) <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #e2e8f0',
                                    fontSize: '16px'
                                }}
                                step="0.01"
                                placeholder="9.2"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#475569' }}>
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
                                borderRadius: '12px',
                                border: '2px solid #e2e8f0',
                                fontSize: '16px'
                            }}
                            step="0.1"
                            placeholder="45"
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#475569' }}>
                            Заметки
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '2px solid #e2e8f0',
                                fontSize: '16px',
                                minHeight: '80px',
                                resize: 'vertical'
                            }}
                            placeholder="Дополнительная информация..."
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
                                background: loading ? '#94a3b8' : '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? <Loader size={18} /> : <Save size={18} />}
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        
                        <Link 
                            to={`/child/${child_id}`}
                            style={{
                                padding: '12px 30px',
                                background: '#f1f5f9',
                                color: '#64748b',
                                textDecoration: 'none',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}
                        >
                            Отмена
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddMeasurement;