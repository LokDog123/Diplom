import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Baby, Calendar, User, Ruler, Weight, Activity } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import axios from 'axios';

function ChildProfile() {
    const { child_id } = useParams();
    const navigate = useNavigate();
    const [child, setChild] = useState(null);
    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChart, setActiveChart] = useState('height');

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
            // Получаем данные ребенка
            const childResponse = await axios.get(`http://localhost:5000/api/children/${child_id}`);
            if (childResponse.data.success) {
                setChild(childResponse.data.child);
            }

            // Получаем замеры ребенка
            const measurementsResponse = await axios.get(`http://localhost:5000/api/measurements/child/${child_id}`);
            if (measurementsResponse.data.success) {
                // Сортируем замеры по дате для графика
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

    // Форматируем данные для графика
    const chartData = measurements.map(meas => ({
        date: formatDate(meas.date),
        age: calculateAgeWithPrecision(meas.date, child?.birth_date),
        height: meas.height,
        weight: meas.weight,
        head: meas.head_circumference,
        fullDate: meas.date
    }));

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

    if (!child) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Ребенок не найден</h2>
                <Link to="/dashboard">Вернуться к списку детей</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            {/* Шапка */}
            <header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '40px' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link 
                        to="/dashboard" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            textDecoration: 'none', 
                            color: '#7f8c8d',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: '#f0f4f8'
                        }}
                    >
                        <ArrowLeft size={20} />
                        Назад
                    </Link>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: child.gender === 'male' ? '#3498db' : '#e84393',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Baby size={30} color="white" />
                        </div>
                        
                        <div>
                            <h1 style={{ fontSize: '32px', color: '#2c3e50', marginBottom: '5px' }}>
                                {child.name}
                            </h1>
                            <div style={{ display: 'flex', gap: '20px', color: '#7f8c8d', fontSize: '14px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <User size={14} />
                                    Пол: {child.gender === 'male' ? 'Мальчик' : 'Девочка'}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Calendar size={14} />
                                    Дата рождения: {formatDate(child.birth_date)}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Activity size={14} />
                                    Возраст: {calculateAge(child.birth_date)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <Link 
                    to={`/child/${child_id}/add-measurement`}
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
                    Добавить замер
                </Link>
            </header>

            {/* Статистика */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px',
                marginBottom: '30px'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                    border: '1px solid #e0e6ed'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: '#3498db20',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Ruler size={20} color="#3498db" />
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Последний рост</div>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50' }}>
                                {measurements[measurements.length - 1]?.height || '—'} см
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                    border: '1px solid #e0e6ed'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: '#27ae6020',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Weight size={20} color="#27ae60" />
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Последний вес</div>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50' }}>
                                {measurements[measurements.length - 1]?.weight || '—'} кг
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                    border: '1px solid #e0e6ed'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: '#e67e2220',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Activity size={20} color="#e67e22" />
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Всего замеров</div>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50' }}>
                                {measurements.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Переключатель графиков */}
            {measurements.length > 0 && (
                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginBottom: '20px',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={() => setActiveChart('height')}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            background: activeChart === 'height' ? '#3498db' : '#f0f4f8',
                            color: activeChart === 'height' ? 'white' : '#2c3e50',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Рост
                    </button>
                    <button
                        onClick={() => setActiveChart('weight')}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            background: activeChart === 'weight' ? '#3498db' : '#f0f4f8',
                            color: activeChart === 'weight' ? 'white' : '#2c3e50',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Вес
                    </button>
                    <button
                        onClick={() => setActiveChart('head')}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            background: activeChart === 'head' ? '#3498db' : '#f0f4f8',
                            color: activeChart === 'head' ? 'white' : '#2c3e50',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Окружность головы
                    </button>
                </div>
            )}

            {/* Графики */}
            <div style={{ 
                background: 'white', 
                borderRadius: '20px', 
                padding: '30px', 
                marginBottom: '30px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                border: '1px solid #e0e6ed'
            }}>
                <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                    {activeChart === 'height' && 'Динамика роста'}
                    {activeChart === 'weight' && 'Динамика веса'}
                    {activeChart === 'head' && 'Динамика окружности головы'}
                </h2>
                
                {measurements.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <RechartsLineChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e6ed" />
                            <XAxis 
                                dataKey="date" 
                                label={{ value: 'Дата', position: 'insideBottom', offset: -10 }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis 
                                yAxisId="left"
                                label={{ 
                                    value: activeChart === 'height' ? 'Рост (см)' : 
                                           activeChart === 'weight' ? 'Вес (кг)' : 'Окружность (см)', 
                                    angle: -90, 
                                    position: 'insideLeft' 
                                }}
                            />
                            <Tooltip />
                            <Legend />
                            
                            {/* Линия с данными ребенка */}
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey={activeChart}
                                stroke="#3498db"
                                strokeWidth={3}
                                dot={{ r: 6, fill: '#3498db' }}
                                activeDot={{ r: 8 }}
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
                                label="Нижняя граница нормы" 
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
                                label="Верхняя граница нормы" 
                            />
                        </RechartsLineChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <Activity size={64} color="#cbd5e0" style={{ marginBottom: '20px' }} />
                        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
                            Добавьте первый замер, чтобы увидеть динамику
                        </p>
                    </div>
                )}
            </div>

            {/* История замеров */}
            <div style={{ 
                background: 'white', 
                borderRadius: '20px', 
                padding: '30px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                border: '1px solid #e0e6ed'
            }}>
                <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>История замеров</h2>
                
                {measurements.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e0e6ed' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#7f8c8d' }}>Дата</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#7f8c8d' }}>Возраст</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#7f8c8d' }}>Рост (см)</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#7f8c8d' }}>Вес (кг)</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#7f8c8d' }}>Окружность головы (см)</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#7f8c8d' }}>Заметки</th>
                                </tr>
                            </thead>
                            <tbody>
                                {measurements.map((meas, index) => (
                                    <tr key={meas.measurement_id} style={{ 
                                        borderBottom: '1px solid #e0e6ed',
                                        background: index % 2 === 0 ? '#f9f9f9' : 'white'
                                    }}>
                                        <td style={{ padding: '12px' }}>{formatDate(meas.date)}</td>
                                        <td style={{ padding: '12px' }}>
                                            {calculateAgeWithPrecision(meas.date, child?.birth_date)} мес
                                        </td>
                                        <td style={{ padding: '12px' }}>{meas.height}</td>
                                        <td style={{ padding: '12px' }}>{meas.weight}</td>
                                        <td style={{ padding: '12px' }}>{meas.head_circumference || '—'}</td>
                                        <td style={{ padding: '12px' }}>{meas.notes || '—'}</td>
                                    </tr>
                                ))}
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