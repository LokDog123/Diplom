import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, User, LogOut, Settings, Baby, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

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
            <div className="loading-container">
                Загрузка...
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Мои дети</h1>
                    <p className="children-count">
                        {children.length} {children.length === 1 ? 'ребенок' : 
                         children.length >= 2 && children.length <= 4 ? 'ребенка' : 'детей'}
                    </p>
                </div>
                
                <div className="header-actions">
                    <Link to="/add-child" className="btn-primary">
                        <Plus size={20} />
                        Добавить ребенка
                    </Link>
                    
                    <div className="user-menu-container">
                        <div 
                            className="user-menu-trigger"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <div className="user-avatar">
                                <User size={20} />
                            </div>
                            <span>{user?.name || 'Пользователь'}</span>
                        </div>

                        {showMenu && (
                            <div className="user-dropdown">
                                <div className="user-info">
                                    <div className="user-name">{user?.name} {user?.lastname}</div>
                                    <div className="user-email">{user?.email}</div>
                                </div>
                                
                                <Link 
                                    to="/profile"
                                    className="dropdown-item"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <Settings size={18} />
                                    <span>Профиль</span>
                                </Link>
                                
                                <button 
                                    onClick={handleLogout}
                                    className="dropdown-item logout"
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
                <div className="error-message">
                    {error}
                </div>
            )}

            {children.length > 0 ? (
                <div className="children-grid">
                    {children.map(child => (
                        <Link 
                            to={`/child/${child.child_id}`} 
                            key={child.child_id} 
                            className="child-card"
                        >
                            <div className="child-card-header">
                                <div className={`child-avatar ${child.gender === 'male' ? 'male' : 'female'}`}>
                                    <Baby size={20} />
                                </div>
                                <h3>{child.name}</h3>
                                <span className="child-age-badge">
                                    {calculateAge(child.birth_date)}
                                </span>
                            </div>
                            
                            <div className="child-info">
                                <div>
                                    <User size={14} />
                                    <span>Пол: {child.gender === 'male' ? 'Мальчик' : 'Девочка'}</span>
                                </div>
                                <div>
                                    <Calendar size={14} />
                                    <span>Дата рождения: {formatDate(child.birth_date)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <Baby size={64} />
                    <h3>У вас пока нет детей</h3>
                    <p>Добавьте первого ребенка, чтобы начать отслеживать его развитие</p>
                    <Link to="/add-child" className="btn-primary">
                        <Plus size={20} />
                        Добавить ребенка
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Dashboard;