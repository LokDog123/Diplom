import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Baby, ArrowLeft } from 'lucide-react';
import axios from 'axios';

function AddChild() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        gender: 'male'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.birth_date) {
            setError('Заполните все поля');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/children', {
                parent_id: user.parent_id,
                name: formData.name,
                birth_date: formData.birth_date,
                gender: formData.gender
            });

            if (response.data.success) {
                navigate('/dashboard');
            }
        } catch (error) {
            setError('Ошибка при добавлении ребенка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '40px 20px',
            color: '#1e293b'
        }}>

            {/* Назад */}
            <button
                onClick={() => navigate('/dashboard')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px',
                    border: 'none',
                    background: 'transparent',
                    color: '#3498db',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                <ArrowLeft size={20} />
                Назад
            </button>

            {/* Карточка */}
            <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <Baby size={48} color="#3498db" style={{ marginBottom: '15px' }} />
                    <h2 style={{ color: '#1e293b' }}>
                        Добавить ребенка
                    </h2>
                </div>

                {/* Ошибка */}
                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        textAlign: 'center',
                        border: '1px solid #ef4444'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Имя */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#475569'
                        }}>
                            Имя ребенка
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Анна"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#1e293b'
                            }}
                        />
                    </div>

                    {/* Дата */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#475569'
                        }}>
                            Дата рождения
                        </label>
                        <input
                            type="date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#1e293b'
                            }}
                        />
                    </div>

                    {/* Пол */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#475569'
                        }}>
                            Пол
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#1e293b'
                            }}
                        >
                            <option value="male">Мальчик</option>
                            <option value="female">Девочка</option>
                        </select>
                    </div>

                    {/* Кнопка */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading ? '#94a3b8' : '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Сохранение...' : 'Добавить ребенка'}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default AddChild;