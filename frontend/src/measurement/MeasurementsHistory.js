import React, { useState } from 'react';
import { Edit, Trash2, Save, X } from 'lucide-react';
import axios from 'axios';

function MeasurementsHistory({ measurements, child, child_id, calculateAgeWithPrecision, formatDate, onMeasurementDeleted, onMeasurementUpdated }) {
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        date: '',
        height: '',
        weight: '',
        head_circumference: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

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

    const handleDeleteClick = (measurement_id) => {
        setDeleteConfirm({ show: true, id: measurement_id });
    };

    const handleDeleteConfirm = async () => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:5000/api/measurements/${deleteConfirm.id}`);
            setDeleteConfirm({ show: false, id: null });
            if (onMeasurementDeleted) {
                onMeasurementDeleted();
            }
        } catch (error) {
            console.error('Ошибка удаления замера:', error);
            alert('Ошибка при удалении замера');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ show: false, id: null });
    };

    const handleEditClick = (measurement) => {
        setEditingId(measurement.measurement_id);
        setEditForm({
            date: measurement.date ? measurement.date.split('T')[0] : '',
            height: measurement.height || '',
            weight: measurement.weight || '',
            head_circumference: measurement.head_circumference || '',
            notes: measurement.notes || ''
        });
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleEditSubmit = async (measurement_id) => {
        try {
            setLoading(true);
            const payload = {
                date: editForm.date,
                height: parseFloat(editForm.height),
                weight: parseFloat(editForm.weight),
                head_circumference: editForm.head_circumference ? parseFloat(editForm.head_circumference) : null,
                notes: editForm.notes || null
            };
            
            await axios.put(`http://localhost:5000/api/measurements/${measurement_id}`, payload);
            setEditingId(null);
            if (onMeasurementUpdated) {
                onMeasurementUpdated();
            }
        } catch (error) {
            console.error('Ошибка обновления замера:', error);
            alert('Ошибка при обновлении замера');
        } finally {
            setLoading(false);
        }
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditForm({
            date: '',
            height: '',
            weight: '',
            head_circumference: '',
            notes: ''
        });
    };

    if (measurements.length === 0) {
        return (
            <div className="history-container">
                <h2 className="history-title">История замеров</h2>
                <div className="empty-state">
                    <p>У ребенка пока нет замеров</p>
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
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {measurements.map((meas) => {
                            const ageMonths = calculateAgeWithPrecision(meas.date, child?.birth_date);
                            const heightNormal = isNormal(meas.height, ageMonths, child?.gender, 'height');
                            const weightNormal = isNormal(meas.weight, ageMonths, child?.gender, 'weight');
                            const headNormal = isNormal(meas.head_circumference, ageMonths, child?.gender, 'head');
                            
                            if (editingId === meas.measurement_id) {
                                return (
                                    <tr key={meas.measurement_id} className="editing-row">
                                        <td>
                                            <input
                                                type="date"
                                                name="date"
                                                value={editForm.date}
                                                onChange={handleEditChange}
                                                className="edit-input"
                                            />
                                        </td>
                                        <td>{ageMonths} мес</td>
                                        <td>
                                            <input
                                                type="number"
                                                name="height"
                                                value={editForm.height}
                                                onChange={handleEditChange}
                                                step="0.1"
                                                className="edit-input"
                                                placeholder="Рост"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="weight"
                                                value={editForm.weight}
                                                onChange={handleEditChange}
                                                step="0.01"
                                                className="edit-input"
                                                placeholder="Вес"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="head_circumference"
                                                value={editForm.head_circumference}
                                                onChange={handleEditChange}
                                                step="0.1"
                                                className="edit-input"
                                                placeholder="ОГ"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="notes"
                                                value={editForm.notes}
                                                onChange={handleEditChange}
                                                className="edit-input"
                                                placeholder="Заметки"
                                            />
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => handleEditSubmit(meas.measurement_id)}
                                                    className="icon-btn save-btn"
                                                    disabled={loading}
                                                    title="Сохранить"
                                                >
                                                    <Save size={16} />
                                                </button>
                                                <button
                                                    onClick={handleEditCancel}
                                                    className="icon-btn cancel-btn"
                                                    disabled={loading}
                                                    title="Отмена"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                            
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
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => handleEditClick(meas)}
                                                className="icon-btn edit-btn"
                                                title="Редактировать"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(meas.measurement_id)}
                                                className="icon-btn delete-btn"
                                                title="Удалить"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Модальное окно подтверждения удаления */}
            {deleteConfirm.show && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-modal">
                        <p>Вы уверены, что хотите удалить этот замер?</p>
                        <p className="delete-confirm-details">Это действие нельзя отменить.</p>
                        <div className="delete-confirm-actions">
                            <button onClick={handleDeleteCancel} className="cancel-delete-btn">
                                Отмена
                            </button>
                            <button onClick={handleDeleteConfirm} className="confirm-delete-btn">
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MeasurementsHistory;