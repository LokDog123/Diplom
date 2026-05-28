    import React, { useState, useEffect } from 'react';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
    import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';

    function WeightAnalytics({ measurements, child, calculateAgeWithPrecision, formatDate }) {
        const [weightData, setWeightData] = useState([]);
        const [weeklyGain, setWeeklyGain] = useState(null);
        const [dailyGain, setDailyGain] = useState(null);
        const [bmi, setBmi] = useState(null);
        const [bmiStatus, setBmiStatus] = useState('');

        useEffect(() => {
            if (measurements.length >= 2) {
                calculateWeightMetrics();
            }
        }, [measurements]);

        const calculateBMI = (weight, height) => {
            if (!weight || !height) return null;
            // BMI = weight(kg) / (height(m))^2
            const heightInMeters = height / 100;
            return (weight / (heightInMeters * heightInMeters)).toFixed(1);
        };

        const getBMIStatus = (bmi, ageMonths, gender) => {
            if (!bmi) return '';
            
            // Примерные нормы BMI для детей (упрощенно)
            const norms = {
                male: {
                    min: 14 + ageMonths * 0.1,
                    max: 18 + ageMonths * 0.1
                },
                female: {
                    min: 13.5 + ageMonths * 0.1,
                    max: 17.5 + ageMonths * 0.1
                }
            };

            const norm = norms[gender];
            if (bmi < norm.min) return 'below';
            if (bmi > norm.max) return 'above';
            return 'normal';
        };

        const calculateWeightMetrics = () => {
            const sorted = [...measurements].sort((a, b) => new Date(a.date) - new Date(b.date));
            
            const data = sorted.map(meas => {
                const ageMonths = calculateAgeWithPrecision(meas.date, child?.birth_date);
                const bmiValue = calculateBMI(meas.weight, meas.height);
                return {
                    date: formatDate(meas.date),
                    fullDate: meas.date,
                    age: ageMonths,
                    weight: meas.weight,
                    bmi: bmiValue
                };
            });
            setWeightData(data);

            if (sorted.length >= 2) {
                const last = sorted[sorted.length - 1];
                const prev = sorted[sorted.length - 2];
                
                const daysDiff = Math.abs((new Date(last.date) - new Date(prev.date)) / (1000 * 60 * 60 * 24));
                const weightDiff = last.weight - prev.weight;
                
                if (daysDiff > 0) {
                    const daily = (weightDiff / daysDiff).toFixed(2);
                    setDailyGain(daily);
                    
                    const weekly = (daily * 7).toFixed(2);
                    setWeeklyGain(weekly);
                }

                const currentBMI = calculateBMI(last.weight, last.height);
                setBmi(currentBMI);
                
                const ageMonths = calculateAgeWithPrecision(last.date, child?.birth_date);
                setBmiStatus(getBMIStatus(parseFloat(currentBMI), ageMonths, child?.gender));
            }
        };

        const getBMIColor = () => {
            switch(bmiStatus) {
                case 'below': return '#e74c3c';
                case 'above': return '#e74c3c';
                default: return '#27ae60';
            }
        };

        const getBMIText = () => {
            switch(bmiStatus) {
                case 'below': return 'Ниже нормы';
                case 'above': return 'Выше нормы';
                default: return 'В норме';
            }
        };

        const getGainStatus = (gain) => {
            if (!gain) return null;
            if (gain < 0.5) return { color: '#e74c3c', text: 'Недостаточный' };
            if (gain > 1.5) return { color: '#e74c3c', text: 'Избыточный' };
            return { color: '#27ae60', text: 'Нормальный' };
        };

        const weeklyStatus = getGainStatus(parseFloat(weeklyGain));

        const CustomTooltip = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                    <div className="custom-tooltip">
                        <p className="tooltip-date">{label}</p>
                        <p className="tooltip-value">Вес: {data.weight} кг</p>
                        {data.bmi && <p className="tooltip-value">BMI: {data.bmi}</p>}
                        <p className="tooltip-age">Возраст: {data.age} мес</p>
                    </div>
                );
            }
            return null;
        };

        return (
            <div className="analytics-container">
                <h2 className="section-title">Анализ веса</h2>

                {measurements.length >= 2 ? (
                    <>
                        <div className="weight-metrics-grid">
                            <div className="metric-card">
                                <div className="metric-header">
                                    <TrendingUp size={20} color="#3498db" />
                                    <h3>Дневной набор</h3>
                                </div>
                                <div className="metric-value" style={{ color: weeklyStatus?.color || '#2c3e50' }}>
                                    {dailyGain ? `${dailyGain} кг/день` : '—'}
                                </div>
                                <div className="metric-status" style={{ color: weeklyStatus?.color }}>
                                    {weeklyStatus?.text}
                                </div>
                            </div>

                            <div className="metric-card">
                                <div className="metric-header">
                                    <Calendar size={20} color="#3498db" />
                                    <h3>Недельный набор</h3>
                                </div>
                                <div className="metric-value" style={{ color: weeklyStatus?.color || '#2c3e50' }}>
                                    {weeklyGain ? `${weeklyGain} кг/неделя` : '—'}
                                </div>
                                <div className="metric-status" style={{ color: weeklyStatus?.color }}>
                                    {weeklyStatus?.text}
                                </div>
                            </div>

                            <div className="metric-card">
                                <div className="metric-header">
                                    {bmiStatus === 'below' ? <TrendingDown size={20} color="#e74c3c" /> :
                                    bmiStatus === 'above' ? <TrendingUp size={20} color="#e74c3c" /> :
                                    <Minus size={20} color="#27ae60" />}
                                    <h3>Индекс массы тела</h3>
                                </div>
                                <div className="metric-value" style={{ color: getBMIColor() }}>
                                    {bmi || '—'}
                                </div>
                                <div className="metric-status" style={{ color: getBMIColor() }}>
                                    {getBMIText()}
                                </div>
                            </div>
                        </div>

                        <div className="chart-container">
                            <h3 className="chart-subtitle">Динамика веса и BMI</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={weightData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e6ed" />
                                    <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                                    <YAxis yAxisId="left" label={{ value: 'Вес (кг)', angle: -90, position: 'insideLeft' }} />
                                    <YAxis yAxisId="right" orientation="right" label={{ value: 'BMI', angle: 90, position: 'insideRight' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#3498db" strokeWidth={2} dot={{ r: 4 }} name="Вес" />
                                    <Line yAxisId="right" type="monotone" dataKey="bmi" stroke="#e67e22" strokeWidth={2} dot={{ r: 4 }} name="BMI" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <p>Добавьте минимум 2 замера для анализа веса</p>
                    </div>
                )}
            </div>
        );
    }

    export default WeightAnalytics;