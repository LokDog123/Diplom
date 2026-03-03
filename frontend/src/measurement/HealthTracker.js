import React, { useState } from 'react';
import { Plus, AlertCircle, Thermometer, Droplet, Pill, Activity } from 'lucide-react';
import axios from 'axios';

function HealthTracker({ child_id, healthData, setHealthData, formatDate }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newHealth, setNewHealth] = useState({
        date: new Date().toISOString().split('T')[0],
        type: 'toilet',
        value: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    const healthTypes = [
        { value: 'toilet', label: 'Поход в туалет', icon: Droplet },
        { value: 'spitup', label: 'Срыгивание', icon: AlertCircle },
        { value: 'temperature', label: 'Температура', icon: Thermometer },
        { value: 'medication', label: 'Лекарство', icon: Pill },
        { value: 'symptom', label: 'Симптом', icon: Activity }
    ];

    const toiletOptions = [
        { value: 'pee', label: 'Мочеиспускание', icon: Droplet },
        { value: 'poop_normal', label: 'Стул (нормальный)', icon: Activity },
        { value: 'poop_diarrhea', label: 'Стул (жидкий)', icon: Activity },
        { value: 'poop_constipation', label: 'Стул (запор)', icon: Activity }
    ];

    const handleAddHealth = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post('http://localhost:5000/api/health', {
                child_id,
                ...newHealth
            });

            if (response.data.success) {
                setHealthData([...healthData, { ...newHealth, id: response.data.id }]);
                setShowAddForm(false);
                setNewHealth({
                    date: new Date().toISOString().split('T')[0],
                    type: 'toilet',
                    value: '',
                    notes: ''
                });
            }
        } catch (error) {
            console.error('Ошибка при добавлении:', error);
            alert('Ошибка при сохранении');
        } finally {
            setLoading(false);
        }
    };

    const getHealthIcon = (type) => {
        const healthType = healthTypes.find(t => t.value === type);
        if (!healthType) return Activity;
        return healthType.icon;
    };

    const getHealthLabel = (item) => {
        if (item.type === 'toilet') {
            const option = toiletOptions.find(o => o.value === item.value);
            return option ? option.label : item.value;
        }
        return item.value;
    };

    return (
        <div className="health-container">
            <div className="section-header">
                <h2 className="section-title">Здоровье и самочувствие</h2>
                <button 
                    className="add-health-btn"
                    onClick={() => setShowAddForm(true)}
                >
                    <Plus size={16} />
                    Добавить запись
                </button>
            </div>

            {showAddForm && (
                <div className="add-health-form">
                    <h3>Новая запись о здоровье</h3>
                    <form onSubmit={handleAddHealth}>
                        <div className="form-group">
                            <label>Дата</label>
                            <input
                                type="date"
                                value={newHealth.date}
                                onChange={(e) => setNewHealth({...newHealth, date: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Тип записи</label>
                            <div className="health-type-options">
                                {healthTypes.map(type => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.value}
                                            type="button"
                                            className={`health-type-btn ${newHealth.type === type.value ? 'selected' : ''}`}
                                            onClick={() => setNewHealth({...newHealth, type: type.value, value: ''})}
                                        >
                                            <Icon size={20} />
                                            {type.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {newHealth.type === 'toilet' && (
                            <div className="form-group">
                                <label>Тип</label>
                                <div className="toilet-options">
                                    {toiletOptions.map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={`toilet-btn ${newHealth.value === option.value ? 'selected' : ''}`}
                                            onClick={() => setNewHealth({...newHealth, value: option.value})}
                                        >
                                            <option.icon size={16} />
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {newHealth.type === 'spitup' && (
                            <div className="form-group">
                                <label>Количество срыгиваний</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={newHealth.value}
                                    onChange={(e) => setNewHealth({...newHealth, value: e.target.value})}
                                    placeholder="Например: 2"
                                />
                            </div>
                        )}

                        {newHealth.type === 'temperature' && (
                            <div className="form-group">
                                <label>Температура (°C)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="35"
                                    max="42"
                                    value={newHealth.value}
                                    onChange={(e) => setNewHealth({...newHealth, value: e.target.value})}
                                    placeholder="36.6"
                                />
                            </div>
                        )}

                        {(newHealth.type === 'medication' || newHealth.type === 'symptom') && (
                            <div className="form-group">
                                <label>Описание</label>
                                <input
                                    type="text"
                                    value={newHealth.value}
                                    onChange={(e) => setNewHealth({...newHealth, value: e.target.value})}
                                    placeholder={newHealth.type === 'medication' ? 'Название лекарства' : 'Опишите симптом'}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Заметки</label>
                            <textarea
                                value={newHealth.notes}
                                onChange={(e) => setNewHealth({...newHealth, notes: e.target.value})}
                                placeholder="Дополнительная информация..."
                                rows="3"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={loading}>
                                {loading ? 'Сохранение...' : 'Сохранить'}
                            </button>
                            <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="health-history">
                {healthData.length > 0 ? (
                    <div className="health-timeline">
                        {healthData.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, index) => {
                            const Icon = getHealthIcon(item.type);
                            const healthType = healthTypes.find(t => t.value === item.type);
                            
                            let bgColor = '#3498db20';
                            let textColor = '#3498db';
                            
                            if (item.type === 'temperature' && item.value > 37.5) {
                                bgColor = '#e74c3c20';
                                textColor = '#e74c3c';
                            } else if (item.type === 'spitup' && item.value > 3) {
                                bgColor = '#e74c3c20';
                                textColor = '#e74c3c';
                            }

                            return (
                                <div key={index} className="health-item">
                                    <div className="health-date">{formatDate(item.date)}</div>
                                    <div className="health-content">
                                        <div className="health-header">
                                            <div className="health-icon" style={{ backgroundColor: bgColor, color: textColor }}>
                                                <Icon size={16} />
                                            </div>
                                            <span className="health-type">{healthType?.label}</span>
                                            {item.value && (
                                                <span className="health-value" style={{ color: textColor }}>
                                                    {getHealthLabel(item)}
                                                </span>
                                            )}
                                        </div>
                                        {item.notes && (
                                            <div className="health-notes">{item.notes}</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Activity size={48} color="#cbd5e0" />
                        <p>Нет записей о здоровье</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HealthTracker;