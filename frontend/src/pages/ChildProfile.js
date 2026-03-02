import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Baby, Calendar, User, Ruler, Weight, Activity, Edit, Trash2, Save, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import axios from 'axios';
import './ChildProfile.css';

function ChildProfile() {
    const { child_id } = useParams();
    const navigate = useNavigate();
    const [child, setChild] = useState(null);
    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChart, setActiveChart] = useState('height');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        birth_date: '',
        gender: 'male'
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const calculateAgeWithPrecision = useCallback((measureDate, birthDate) => {
        if (!birthDate) return 0;
        const birth = new Date(birthDate);
        const meas = new Date(measureDate);
        const months = (meas.getFullYear() - birth.getFullYear()) * 12 + 
                      (meas.getMonth() - birth.getMonth());
        return months;
    }, []);

    const fetchChildData = useCallback(async () => {
        try {
            const childResponse = await axios.get(`http://localhost:5000/api/children/${child_id}`);
            if (childResponse.data.success) {
                setChild(childResponse.data.child);
                setEditForm({
                    name: childResponse.data.child.name,
                    birth_date: childResponse.data.child.birth_date.split('T')[0],
                    gender: childResponse.data.child.gender
                });
            }

            const measurementsResponse = await axios.get(`http://localhost:5000/api/measurements/child/${child_id}`);
            if (measurementsResponse.data.success) {
                const sortedMeasurements = measurementsResponse.data.measurements.sort((a, b) => 
                    new Date(a.date) - new Date(b.date)
                );
                setMeasurements(sortedMeasurements);
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        } finally {
            setLoading(false);
        }
    }, [child_id]);

    useEffect(() => {
        fetchChildData();
    }, [fetchChildData]);

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/children/${child_id}`, {
                name: editForm.name,
                birth_date: editForm.birth_date,
                gender: editForm.gender
            });

            if (response.data.success) {
                setChild({
                    ...child,
                    name: editForm.name,
                    birth_date: editForm.birth_date,
                    gender: editForm.gender
                });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Ошибка при обновлении:', error);
            alert('Ошибка при обновлении данных ребенка');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/children/${child_id}`);
            if (response.data.success) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            alert('Ошибка при удалении ребенка');
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
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    // Получаем нормативные значения для возраста
    const getNormsForAge = (ageMonths, gender, type) => {
        const norms = {
            height: {
                male: { min: 46.3 + ageMonths * 1.5, max: 53.4 + ageMonths * 1.5 },
                female: { min: 45.8 + ageMonths * 1.4, max: 52.7 + ageMonths * 1.4 }
            },
            weight: {
                male: { min: 2.5 + ageMonths * 0.5, max: 4.3 + ageMonths * 0.7 },
                female: { min: 2.4 + ageMonths * 0.45, max: 4.2 + ageMonths * 0.65 }
            },
            head: {
                male: { min: 32.1 + ageMonths * 0.3, max: 36.9 + ageMonths * 0.3 },
                female: { min: 31.7 + ageMonths * 0.3, max: 36.2 + ageMonths * 0.3 }
            }
        };
        
        return norms[type][gender];
    };

    // Проверяем, находится ли значение в норме
    const isNormal = (value, ageMonths, gender, type) => {
        if (!value) return true;
        const norms = getNormsForAge(ageMonths, gender, type);
        return value >= norms.min && value <= norms.max;
    };

    // Форматируем данные для графика с информацией об аномалиях
    const chartData = measurements.map(meas => {
        const ageMonths = calculateAgeWithPrecision(meas.date, child?.birth_date);
        const heightNormal = isNormal(meas.height, ageMonths, child?.gender, 'height');
        const weightNormal = isNormal(meas.weight, ageMonths, child?.gender, 'weight');
        const headNormal = isNormal(meas.head_circumference, ageMonths, child?.gender, 'head');
        
        return {
            date: formatDate(meas.date),
            fullDate: meas.date,
            age: ageMonths,
            height: meas.height,
            weight: meas.weight,
            head: meas.head_circumference,
            heightNormal,
            weightNormal,
            headNormal,
        };
    });

    // Кастомный тоолтип
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const type = activeChart;
            const value = data[type];
            const isNormal = data[`${type}Normal`];
            const norms = getNormsForAge(data.age, child?.gender, type);
            
            return (
                <div style={{
                    background: 'white',
                    padding: '10px 15px',
                    border: '1px solid #e0e6ed',
                    borderRadius: '8px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ margin: '0 0 5px', fontWeight: '600' }}>{label}</p>
                    <p style={{ margin: '0', color: isNormal ? '#27ae60' : '#e74c3c' }}>
                        {type === 'height' && `Рост: ${value} см`}
                        {type === 'weight' && `Вес: ${value} кг`}
                        {type === 'head' && `Окружность: ${value} см`}
                    </p>
                    {!isNormal && (
                        <p style={{ margin: '5px 0 0', color: '#e74c3c', fontSize: '12px' }}>
                            ⚠️ Отклонение от нормы
                        </p>
                    )}
                    <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#7f8c8d' }}>
                        Норма: {norms.min.toFixed(1)} - {norms.max.toFixed(1)}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#7f8c8d' }}>
                        Возраст: {data.age} мес
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (!child) {
        return (
            <div className="not-found">
                <h2>Ребенок не найден</h2>
                <Link to="/dashboard" className="not-found-link">Вернуться к списку детей</Link>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Шапка */}
            <header className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                    <Link to="/dashboard" className="back-link">
                        <ArrowLeft size={20} />
                        Назад
                    </Link>
                    
                    {!isEditing ? (
                        <div className="child-info">
                            <div className={`child-avatar ${child.gender === 'male' ? 'male' : 'female'}`}>
                                <Baby size={30} color="white" />
                            </div>
                            
                            <div>
                                <h1 className="child-name">{child.name}</h1>
                                <div className="child-details">
                                    <span>
                                        <User size={14} />
                                        Пол: {child.gender === 'male' ? 'Мальчик' : 'Девочка'}
                                    </span>
                                    <span>
                                        <Calendar size={14} />
                                        Дата рождения: {formatDate(child.birth_date)}
                                    </span>
                                    <span>
                                        <Activity size={14} />
                                        Возраст: {calculateAge(child.birth_date)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleEditSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center', flex: 1 }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                    placeholder="Имя ребенка"
                                    style={{
                                        padding: '8px 12px',
                                        border: '2px solid #3498db',
                                        borderRadius: '8px',
                                        fontSize: '16px'
                                    }}
                                    required
                                />
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={editForm.birth_date}
                                    onChange={handleEditChange}
                                    style={{
                                        padding: '8px 12px',
                                        border: '2px solid #3498db',
                                        borderRadius: '8px',
                                        fontSize: '16px'
                                    }}
                                    required
                                />
                                <select
                                    name="gender"
                                    value={editForm.gender}
                                    onChange={handleEditChange}
                                    style={{
                                        padding: '8px 12px',
                                        border: '2px solid #3498db',
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
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '8px 16px',
                                    background: '#27ae60',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <Save size={16} />
                                Сохранить
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '8px 16px',
                                    background: '#95a5a6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={16} />
                                Отмена
                            </button>
                        </form>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {!isEditing && (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '8px 16px',
                                    background: '#f39c12',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <Edit size={16} />
                                Редактировать
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '8px 16px',
                                    background: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <Trash2 size={16} />
                                Удалить
                            </button>
                        </>
                    )}
                    <Link to={`/child/${child_id}/add-measurement`} className="add-measurement-btn">
                        <Plus size={20} />
                        Добавить замер
                    </Link>
                </div>
            </header>

            {/* Модальное окно подтверждения удаления */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        maxWidth: '400px',
                        textAlign: 'center'
                    }}>
                        <Trash2 size={48} color="#e74c3c" style={{ marginBottom: '20px' }} />
                        <h3 style={{ marginBottom: '10px' }}>Удалить профиль ребенка?</h3>
                        <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                            Вы уверены, что хотите удалить профиль {child.name}? 
                            Все замеры также будут удалены. Это действие нельзя отменить.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                onClick={handleDelete}
                                style={{
                                    padding: '10px 20px',
                                    background: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Да, удалить
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                style={{
                                    padding: '10px 20px',
                                    background: '#95a5a6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Статистика */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon height">
                            <Ruler size={20} color="#3498db" />
                        </div>
                        <div>
                            <div className="stat-label">Последний рост</div>
                            <div className="stat-value">
                                {measurements[measurements.length - 1]?.height || '—'} см
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon weight">
                            <Weight size={20} color="#27ae60" />
                        </div>
                        <div>
                            <div className="stat-label">Последний вес</div>
                            <div className="stat-value">
                                {measurements[measurements.length - 1]?.weight || '—'} кг
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon activity">
                            <Activity size={20} color="#e67e22" />
                        </div>
                        <div>
                            <div className="stat-label">Всего замеров</div>
                            <div className="stat-value">{measurements.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Переключатель графиков */}
            {measurements.length > 0 && (
                <div className="chart-switcher">
                    <button
                        onClick={() => setActiveChart('height')}
                        className={`chart-btn ${activeChart === 'height' ? 'active' : ''}`}
                    >
                        Рост
                    </button>
                    <button
                        onClick={() => setActiveChart('weight')}
                        className={`chart-btn ${activeChart === 'weight' ? 'active' : ''}`}
                    >
                        Вес
                    </button>
                    <button
                        onClick={() => setActiveChart('head')}
                        className={`chart-btn ${activeChart === 'head' ? 'active' : ''}`}
                    >
                        Окружность головы
                    </button>
                </div>
            )}

            {/* Графики */}
            <div className="chart-container">
                <h2 className="chart-title">
                    {activeChart === 'height' && 'Динамика роста'}
                    {activeChart === 'weight' && 'Динамика веса'}
                    {activeChart === 'head' && 'Динамика окружности головы'}
                </h2>
                
                {measurements.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e6ed" />
                            <XAxis 
                                dataKey="date" 
                                label={{ 
                                    value: 'Дата', 
                                    position: 'insideBottom', 
                                    offset: 10,
                                    style: { fill: '#7f8c8d', fontSize: 14, fontWeight: 500 }
                                }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis 
                                yAxisId="left"
                                label={{ 
                                    value: activeChart === 'height' ? 'Рост (см)' : 
                                           activeChart === 'weight' ? 'Вес (кг)' : 'Окружность (см)', 
                                    angle: -90, 
                                    position: 'insideLeft',
                                    style: { fill: '#7f8c8d', fontSize: 14, fontWeight: 500 },
                                    offset: 10
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: 20 }} />
                            
                            {/* Линия с данными ребенка - всегда синяя */}
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey={activeChart}
                                stroke="#3498db"
                                strokeWidth={3}
                                dot={(props) => {
                                    const { cx, cy, payload } = props;
                                    const isNormal = payload[`${activeChart}Normal`];
                                    return (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={6}
                                            fill={isNormal ? '#3498db' : '#e74c3c'}
                                            stroke="white"
                                            strokeWidth={2}
                                        />
                                    );
                                }}
                                activeDot={{ r: 8, fill: '#3498db' }}
                                name={activeChart === 'height' ? 'Рост' : 
                                      activeChart === 'weight' ? 'Вес' : 'Окружность головы'}
                            />
                            
                            {/* Нормативные линии ВОЗ */}
                            <ReferenceLine 
                                yAxisId="left"
                                y={activeChart === 'height' ? 
                                    (child?.gender === 'male' ? 46.3 : 45.8) : 
                                   activeChart === 'weight' ? 
                                    (child?.gender === 'male' ? 2.5 : 2.4) : 
                                    (child?.gender === 'male' ? 32.1 : 31.7)} 
                                stroke="#2ecc71" 
                                strokeDasharray="3 3" 
                                label={{ 
                                    value: "Нижняя граница", 
                                    position: 'right',
                                    fill: '#27ae60',
                                    fontSize: 12
                                }} 
                            />
                            <ReferenceLine 
                                yAxisId="left"
                                y={activeChart === 'height' ? 
                                    (child?.gender === 'male' ? 53.4 : 52.7) : 
                                   activeChart === 'weight' ? 
                                    (child?.gender === 'male' ? 4.3 : 4.2) : 
                                    (child?.gender === 'male' ? 36.9 : 36.2)} 
                                stroke="#2ecc71" 
                                strokeDasharray="3 3" 
                                label={{ 
                                    value: "Верхняя граница", 
                                    position: 'right',
                                    fill: '#27ae60',
                                    fontSize: 12
                                }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="empty-chart">
                        <Activity size={64} color="#cbd5e0" />
                        <p>Добавьте первый замер, чтобы увидеть динамику</p>
                    </div>
                )}
            </div>

            {/* История замеров */}
            <div className="history-container">
                <h2 className="history-title">История замеров</h2>
                
                {measurements.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="measurements-table">
                            <thead>
                                <tr>
                                    <th>Дата</th>
                                    <th>Возраст</th>
                                    <th>Рост (см)</th>
                                    <th>Вес (кг)</th>
                                    <th>Окружность головы (см)</th>
                                    <th>Заметки</th>
                                </tr>
                            </thead>
                            <tbody>
                                {measurements.map((meas, index) => {
                                    const ageMonths = calculateAgeWithPrecision(meas.date, child?.birth_date);
                                    const heightNormal = isNormal(meas.height, ageMonths, child?.gender, 'height');
                                    const weightNormal = isNormal(meas.weight, ageMonths, child?.gender, 'weight');
                                    const headNormal = isNormal(meas.head_circumference, ageMonths, child?.gender, 'head');
                                    
                                    return (
                                        <tr key={meas.measurement_id}>
                                            <td>{formatDate(meas.date)}</td>
                                            <td>{ageMonths} мес</td>
                                            <td style={{ 
                                                color: heightNormal ? 'inherit' : '#e74c3c',
                                                fontWeight: heightNormal ? 'normal' : 'bold'
                                            }}>
                                                {meas.height}
                                                {!heightNormal && <span style={{ marginLeft: '5px' }}>⚠️</span>}
                                            </td>
                                            <td style={{ 
                                                color: weightNormal ? 'inherit' : '#e74c3c',
                                                fontWeight: weightNormal ? 'normal' : 'bold'
                                            }}>
                                                {meas.weight}
                                                {!weightNormal && <span style={{ marginLeft: '5px' }}>⚠️</span>}
                                            </td>
                                            <td style={{ 
                                                color: headNormal ? 'inherit' : '#e74c3c',
                                                fontWeight: headNormal ? 'normal' : 'bold'
                                            }}>
                                                {meas.head_circumference || '—'}
                                                {meas.head_circumference && !headNormal && <span style={{ marginLeft: '5px' }}>⚠️</span>}
                                            </td>
                                            <td>{meas.notes || '—'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                            У ребенка пока нет замеров
                        </p>
                        <Link 
                            to={`/child/${child_id}/add-measurement`}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: '#3498db',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '8px'
                            }}
                        >
                            <Plus size={16} />
                            Добавить первый замер
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChildProfile;