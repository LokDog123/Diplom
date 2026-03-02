import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

function MeasurementsHistory({ measurements, child, child_id, calculateAgeWithPrecision, formatDate }) {
    const isNormal = (value, ageMonths, gender, type) => {
        if (!value) return true;
        
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
        
        const norm = norms[type][gender];
        return value >= norm.min && value <= norm.max;
    };

    if (measurements.length === 0) {
        return (
            <div className="history-container">
                <h2 className="history-title">История замеров</h2>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                        У ребенка пока нет замеров
                    </p>
                    <Link 
                        to={`/child/${child_id}/add-measurement`}
                        className="add-first-measurement"
                    >
                        <Plus size={16} />
                        Добавить первый замер
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="history-container">
            <h2 className="history-title">История замеров</h2>
            
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
                        {measurements.map((meas) => {
                            const ageMonths = calculateAgeWithPrecision(meas.date, child?.birth_date);
                            const heightNormal = isNormal(meas.height, ageMonths, child?.gender, 'height');
                            const weightNormal = isNormal(meas.weight, ageMonths, child?.gender, 'weight');
                            const headNormal = isNormal(meas.head_circumference, ageMonths, child?.gender, 'head');
                            
                            return (
                                <tr key={meas.measurement_id}>
                                    <td>{formatDate(meas.date)}</td>
                                    <td>{ageMonths} мес</td>
                                    <td className={!heightNormal ? 'abnormal-value' : ''}>
                                        {meas.height}
                                        {!heightNormal && <span className="warning-icon">⚠️</span>}
                                    </td>
                                    <td className={!weightNormal ? 'abnormal-value' : ''}>
                                        {meas.weight}
                                        {!weightNormal && <span className="warning-icon">⚠️</span>}
                                    </td>
                                    <td className={!headNormal ? 'abnormal-value' : ''}>
                                        {meas.head_circumference || '—'}
                                        {meas.head_circumference && !headNormal && 
                                            <span className="warning-icon">⚠️</span>}
                                    </td>
                                    <td>{meas.notes || '—'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MeasurementsHistory;