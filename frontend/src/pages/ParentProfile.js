import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';

function ParentProfile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        birth_date: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                lastname: user.lastname || '',
                email: user.email || '',
                phone: user.phone || '',
                birth_date: user.birth_date ? user.birth_date.split('T')[0] : ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.put(`http://localhost:5000/api/parents/${user.parent_id}`, formData);
            
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Профиль обновлен!' });
                setIsEditing(false);
                // Обновляем данные в контексте
                const updatedUser = { ...user, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Ошибка при обновлении' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            <button 
                onClick={() => navigate('/dashboard')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    border: 'none',
                    background: '#f0f4f8',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    marginBottom: '30px',
                    color: '#2c3e50'
                }}
            >
                <ArrowLeft size={20} />
                Назад к детям
            </button>

            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#3498db',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <User size={40} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '28px', color: '#2c3e50' }}>
                            {user?.name} {user?.lastname}
                        </h1>
                        <p style={{ color: '#7f8c8d' }}>Профиль родителя</p>
                    </div>
                </div>

                {message && (
                    <div style={{
                        padding: '15px',
                        backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>
                                <User size={16} style={{ marginRight: '5px' }} />
                                Имя
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e0e6ed',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    backgroundColor: isEditing ? 'white' : '#f9f9f9'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>
                                <User size={16} style={{ marginRight: '5px' }} />
                                Фамилия
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                disabled={!isEditing}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e0e6ed',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    backgroundColor: isEditing ? 'white' : '#f9f9f9'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>
                                <Mail size={16} style={{ marginRight: '5px' }} />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e0e6ed',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    backgroundColor: isEditing ? 'white' : '#f9f9f9'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>
                                <Phone size={16} style={{ marginRight: '5px' }} />
                                Телефон
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="+7 (999) 999-99-99"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e0e6ed',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    backgroundColor: isEditing ? 'white' : '#f9f9f9'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#34495e' }}>
                                <Calendar size={16} style={{ marginRight: '5px' }} />
                                Дата рождения
                            </label>
                            <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleChange}
                                disabled={!isEditing}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e0e6ed',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    backgroundColor: isEditing ? 'white' : '#f9f9f9'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                style={{
                                    padding: '12px 30px',
                                    background: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                Редактировать
                            </button>
                        ) : (
                            <>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 30px',
                                        background: '#27ae60',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                >
                                    <Save size={18} />
                                    {loading ? 'Сохранение...' : 'Сохранить'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: user.name || '',
                                            lastname: user.lastname || '',
                                            email: user.email || '',
                                            phone: user.phone || '',
                                            birth_date: user.birth_date ? user.birth_date.split('T')[0] : ''
                                        });
                                    }}
                                    style={{
                                        padding: '12px 30px',
                                        background: '#95a5a6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Отмена
                                </button>
                            </>
                        )}
                        
                        <button
                            type="button"
                            onClick={handleLogout}
                            style={{
                                padding: '12px 30px',
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                marginLeft: 'auto'
                            }}
                        >
                            Выйти
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ParentProfile;