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
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px' }}>
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

            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <Baby size={48} color="#3498db" style={{ marginBottom: '15px' }} />
                    <h2 style={{ color: '#2c3e50' }}>Добавить ребенка</h2>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>
                            Имя ребенка
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e0e6ed',
                                borderRadius: '8px',
                                fontSize: '16px'
                            }}
                            placeholder="Анна"
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>
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
                                border: '2px solid #e0e6ed',
                                borderRadius: '8px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>
                            Пол
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e0e6ed',
                                borderRadius: '8px',
                                fontSize: '16px'
                            }}
                        >
                            <option value="male">Мальчик</option>
                            <option value="female">Девочка</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading ? '#95a5a6' : '#3498db',
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