import React, { useState } from 'react';
import { Plus, AlertCircle, Check, X, Baby, Apple } from 'lucide-react';
import axios from 'axios';

function FeedingTracker({ child_id, feedingData, setFeedingData, formatDate }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newFeeding, setNewFeeding] = useState({
        date: new Date().toISOString().split('T')[0],
        foodType: '',
        reaction: 'normal',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    const foodTypes = [
        'Грудное молоко',
        'Смесь',
        'Овощное пюре',
        'Фруктовое пюре',
        'Каша',
        'Мясное пюре',
        'Рыбное пюре',
        'Творог',
        'Кефир/йогурт',
        'Яичный желток',
        'Сок',
        'Другое'
    ];

    const reactions = [
        { value: 'normal', label: 'Нормально', color: '#27ae60' },
        { value: 'allergy', label: 'Аллергия', color: '#e74c3c' },
        { value: 'rash', label: 'Сыпь', color: '#e67e22' },
        { value: 'diarrhea', label: 'Расстройство', color: '#e74c3c' },
        { value: 'constipation', label: 'Запор', color: '#f39c12' },
        { value: 'vomiting', label: 'Срыгивание/рвота', color: '#e74c3c' }
    ];

    const handleAddFeeding = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post('http://localhost:5000/api/feeding', {
                child_id,
                ...newFeeding
            });

            if (response.data.success) {
                setFeedingData([...feedingData, { ...newFeeding, id: response.data.id }]);
                setShowAddForm(false);
                setNewFeeding({
                    date: new Date().toISOString().split('T')[0],
                    foodType: '',
                    reaction: 'normal',
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

    const getReactionInfo = (reactionValue) => {
        return reactions.find(r => r.value === reactionValue) || reactions[0];
    };

    return (
        <div className="feeding-container">
            <div className="section-header">
                <h2 className="section-title">Питание и прикорм</h2>
                <button 
                    className="add-feeding-btn"
                    onClick={() => setShowAddForm(true)}
                >
                    <Plus size={16} />
                    Добавить запись
                </button>
            </div>

            {showAddForm && (
                <div className="add-feeding-form">
                    <h3>Новая запись о питании</h3>
                    <form onSubmit={handleAddFeeding}>
                        <div className="form-group">
                            <label>Дата</label>
                            <input
                                type="date"
                                value={newFeeding.date}
                                onChange={(e) => setNewFeeding({...newFeeding, date: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Тип питания/продукт</label>
                            <select
                                value={newFeeding.foodType}
                                onChange={(e) => setNewFeeding({...newFeeding, foodType: e.target.value})}
                                required
                            >
                                <option value="">Выберите продукт</option>
                                {foodTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Реакция</label>
                            <div className="reaction-options">
                                {reactions.map(reaction => (
                                    <button
                                        key={reaction.value}
                                        type="button"
                                        className={`reaction-option ${newFeeding.reaction === reaction.value ? 'selected' : ''}`}
                                        style={{ 
                                            backgroundColor: newFeeding.reaction === reaction.value ? reaction.color : 'transparent',
                                            color: newFeeding.reaction === reaction.value ? 'white' : reaction.color,
                                            borderColor: reaction.color
                                        }}
                                        onClick={() => setNewFeeding({...newFeeding, reaction: reaction.value})}
                                    >
                                        {reaction.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Заметки</label>
                            <textarea
                                value={newFeeding.notes}
                                onChange={(e) => setNewFeeding({...newFeeding, notes: e.target.value})}
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

            <div className="feeding-history">
                {feedingData.length > 0 ? (
                    <div className="feeding-timeline">
                        {feedingData.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, index) => {
                            const reaction = getReactionInfo(item.reaction);
                            return (
                                <div key={index} className="feeding-item">
                                    <div className="feeding-date">{formatDate(item.date)}</div>
                                    <div className="feeding-content">
                                        <div className="feeding-header">
                                            <Apple size={16} color="#3498db" />
                                            <span className="feeding-food">{item.foodType}</span>
                                            <span 
                                                className="feeding-reaction"
                                                style={{ 
                                                    backgroundColor: reaction.color + '20',
                                                    color: reaction.color,
                                                    borderColor: reaction.color
                                                }}
                                            >
                                                {item.reaction === 'normal' ? <Check size={12} /> : <AlertCircle size={12} />}
                                                {reaction.label}
                                            </span>
                                        </div>
                                        {item.notes && (
                                            <div className="feeding-notes">{item.notes}</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Baby size={48} color="#cbd5e0" />
                        <p>Нет записей о питании</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FeedingTracker;