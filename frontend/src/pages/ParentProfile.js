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

    const inputStyle = (isEditing) => ({
        width: '100%',
        padding: '12px',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        fontSize: '16px',
        backgroundColor: isEditing ? 'var(--input-bg)' : 'var(--bg-tertiary)',
        color: 'var(--text-primary)'
    });

    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '40px 20px',
            color: 'var(--text-primary)'
        }}>
            <button
                onClick={() => navigate('/dashboard')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    marginBottom: '30px',
                    color: 'var(--text-primary)'
                }}
            >
                <ArrowLeft size={20} />
                Назад к детям
            </button>

            <div style={{
                background: 'var(--bg-card)',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <User size={40} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '28px', color: 'var(--text-primary)' }}>
                            {user?.name} {user?.lastname}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Профиль родителя
                        </p>
                    </div>
                </div>

                {message && (
                    <div style={{
                        padding: '15px',
                        backgroundColor: message.type === 'success'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(239, 68, 68, 0.1)',
                        color: message.type === 'success'
                            ? 'var(--success)'
                            : 'var(--danger)',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: '20px' }}>

                        <div>
                            <label style={{ color: 'var(--text-secondary)' }}>
                                <User size={16} /> Имя
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                style={inputStyle(isEditing)}
                            />
                        </div>

                        <div>
                            <label style={{ color: 'var(--text-secondary)' }}>
                                <User size={16} /> Фамилия
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                disabled={!isEditing}
                                style={inputStyle(isEditing)}
                            />
                        </div>

                        <div>
                            <label style={{ color: 'var(--text-secondary)' }}>
                                <Mail size={16} /> Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                style={inputStyle(isEditing)}
                            />
                        </div>

                        <div>
                            <label style={{ color: 'var(--text-secondary)' }}>
                                <Phone size={16} /> Телефон
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                style={inputStyle(isEditing)}
                            />
                        </div>

                        <div>
                            <label style={{ color: 'var(--text-secondary)' }}>
                                <Calendar size={16} /> Дата рождения
                            </label>
                            <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleChange}
                                disabled={!isEditing}
                                style={inputStyle(isEditing)}
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
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px'
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
                                        background: 'var(--success)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px'
                                    }}
                                >
                                    <Save size={18} />
                                    {loading ? 'Сохранение...' : 'Сохранить'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    style={{
                                        padding: '12px 30px',
                                        background: 'var(--text-muted)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px'
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
                                background: 'var(--danger)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
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