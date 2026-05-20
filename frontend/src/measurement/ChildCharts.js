import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity } from 'lucide-react';

function ChildCharts({ measurements, child, activeChart, setActiveChart, calculateAgeWithPrecision, formatDate }) {
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

    const isNormal = (value, ageMonths, gender, type) => {
        if (!value) return true;
        const norms = getNormsForAge(ageMonths, gender, type);
        return value >= norms.min && value <= norms.max;
    };

    const chartData = measurements.map(meas => {
        const ageMonths = calculateAgeWithPrecision(meas.date, child?.birth_date);
        return {
            date: formatDate(meas.date),
            fullDate: meas.date,
            age: ageMonths,
            height: meas.height,
            weight: meas.weight,
            head: meas.head_circumference,
            heightNormal: isNormal(meas.height, ageMonths, child?.gender, 'height'),
            weightNormal: isNormal(meas.weight, ageMonths, child?.gender, 'weight'),
            headNormal: isNormal(meas.head_circumference, ageMonths, child?.gender, 'head'),
        };
    });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const type = activeChart;
            const value = data[type];
            const isNormal = data[`${type}Normal`];
            const norms = getNormsForAge(data.age, child?.gender, type);
            
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-date">{label}</p>
                    <p className="tooltip-value" style={{ color: isNormal ? '#27ae60' : '#e74c3c' }}>
                        {type === 'height' && `Рост: ${value} см`}
                        {type === 'weight' && `Вес: ${value} кг`}
                        {type === 'head' && `Окружность: ${value} см`}
                    </p>
                    {!isNormal && (
                        <p className="tooltip-warning">⚠️ Отклонение от нормы</p>
                    )}
                    <p className="tooltip-norm">
                        Норма: {norms.min.toFixed(1)} - {norms.max.toFixed(1)}
                    </p>
                    <p className="tooltip-age">Возраст: {data.age} мес</p>
                </div>
            );
        }
        return null;
    };

    if (measurements.length === 0) {
        return (
            <div className="chart-container">
                <h2 className="chart-title">Динамика роста</h2>
                <div className="empty-chart">
                    <Activity size={64} color="#cbd5e0" />
                    <p>Добавьте первый замер, чтобы увидеть динамику</p>
                </div>
            </div>
        );
    }

    return (
        <>
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

            <div className="chart-container">
                <h2 className="chart-title">
                    {activeChart === 'height' && 'Динамика роста'}
                    {activeChart === 'weight' && 'Динамика веса'}
                    {activeChart === 'head' && 'Динамика окружности головы'}
                </h2>
                
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
            </div>
        </>
    );
}

export default ChildCharts;