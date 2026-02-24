import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, User, LogOut, Settings, Baby, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('Dashboard mounted, user:', user);
        if (user?.parent_id) {
            fetchChildren();
        } else {
            setLoading(false);
            setError('Пользователь не авторизован');
        }
    }, [user]);

    const fetchChildren = async () => {
        try {
            console.log('Запрос детей для parent_id:', user.parent_id);
            const response = await axios.get(`http://localhost:5000/api/children/parent/${user.parent_id}`);
            console.log('Ответ от сервера:', response.data);
            
            if (response.data.success) {
                setChildren(response.data.children);
                console.log('Дети загружены:', response.data.children);
            } else {
                setError('Ошибка при загрузке детей');
            }
        } catch (error) {
            console.error('Ошибка загрузки детей:', error);
            setError('Ошибка при загрузке детей: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return 'Не указан';
        const today = new Date();
        const birth = new Date(birthDate);
        const months = (today.getFullYear() - birth.getFullYear()) * 12 + 
                      (today.getMonth() - birth.getMonth());
        
        if (months < 0) return '0 мес';
        if (months >= 12) {
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            return remainingMonths > 0 ? `${years} лет ${remainingMonths} мес` : `${years} лет`;
        }
        return `${months} мес`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Не указана';
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px',
                color: '#7f8c8d'
            }}>
                Загрузка...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '40px',
                position: 'relative'
            }}>
                <div>
                    <h1 style={{ fontSize: '32px', color: '#2c3e50', marginBottom: '5px' }}>Мои дети</h1>
                    <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
                        {children.length} {children.length === 1 ? 'ребенок' : 
                         children.length >= 2 && children.length <= 4 ? 'ребенка' : 'детей'}
                    </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
                            borderRadius: '12px',
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#2980b9'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#3498db'}
                    >
                        <Plus size={20} />
                        Добавить ребенка
                    </Link>

                    <div style={{ position: 'relative' }}>
                        <div 
                            onClick={() => setShowMenu(!showMenu)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 16px',
                                background: '#f0f4f8',
                                borderRadius: '40px',
                                cursor: 'pointer',
                                transition: 'background 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#e0e6ed'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#f0f4f8'}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#3498db',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <User size={20} color="white" />
                            </div>
                            <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                                {user?.name || 'Пользователь'}
                            </span>
                        </div>

                        {showMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '60px',
                                right: '0',
                                width: '280px',
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                padding: '10px',
                                zIndex: 1000
                            }}>
                                <div style={{
                                    padding: '15px',
                                    borderBottom: '1px solid #e0e6ed'
                                }}>
                                    <div style={{ fontWeight: '600', color: '#2c3e50', fontSize: '16px' }}>
                                        {user?.name} {user?.lastname}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '4px' }}>
                                        {user?.email}
                                    </div>
                                </div>
                                
                                <Link 
                                    to="/profile"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '12px 15px',
                                        textDecoration: 'none',
                                        color: '#2c3e50',
                                        borderRadius: '8px',
                                        transition: 'background 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f7fa'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => setShowMenu(false)}
                                >
                                    <Settings size={18} />
                                    <span>Профиль</span>
                                </Link>
                                
                                <button 
                                    onClick={handleLogout}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '12px 15px',
                                        width: '100%',
                                        border: 'none',
                                        background: 'transparent',
                                        color: '#e74c3c',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        textAlign: 'left',
                                        transition: 'background 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#fee9e7'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <LogOut size={18} />
                                    <span>Выйти</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
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

            {children.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {children.map(child => (
                        <Link 
                            to={`/child/${child.child_id}`} 
                            key={child.child_id} 
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                padding: '24px',
                                textDecoration: 'none',
                                color: 'inherit',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                border: '1px solid #e0e6ed'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                            }}
                        >
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                marginBottom: '15px' 
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: child.gender === 'male' ? '#3498db' : '#e84393',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Baby size={20} color="white" />
                                    </div>
                                    <h3 style={{ fontSize: '20px', color: '#2c3e50' }}>{child.name}</h3>
                                </div>
                                <span style={{ 
                                    background: '#f0f4f8', 
                                    padding: '4px 12px', 
                                    borderRadius: '20px', 
                                    fontSize: '14px',
                                    color: '#7f8c8d'
                                }}>
                                    {calculateAge(child.birth_date)}
                                </span>
                            </div>
                            
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '8px', 
                                color: '#7f8c8d',
                                fontSize: '14px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <User size={14} />
                                    <span>Пол: {child.gender === 'male' ? 'Мальчик' : 'Девочка'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={14} />
                                    <span>Дата рождения: {formatDate(child.birth_date)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px',
                    background: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    border: '1px solid #e0e6ed'
                }}>
                    <Baby size={64} color="#cbd5e0" style={{ marginBottom: '20px' }} />
                    <h3 style={{ fontSize: '20px', color: '#2c3e50', marginBottom: '10px' }}>
                        У вас пока нет детей
                    </h3>
                    <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                        Добавьте первого ребенка, чтобы начать отслеживать его развитие
                    </p>
                    <Link 
                        to="/add-child"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 30px',
                            background: '#3498db',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#2980b9'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#3498db'}
                    >
                        <Plus size={20} />
                        Добавить ребенка
                    </Link>
                </div>
            )}

            {showMenu && (
                <div 
                    onClick={() => setShowMenu(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                />
            )}
        </div>
    );
}

export default Dashboard;