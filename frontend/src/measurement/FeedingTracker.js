import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Check, X, Baby, Apple, Edit, Trash2, Save, Settings } from 'lucide-react';
import axios from 'axios';
import FoodProductManager from './FoodProductManager';

function FeedingTracker({ child_id, feedingData, setFeedingData, formatDate }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showProductManager, setShowProductManager] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [foodProducts, setFoodProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newFeeding, setNewFeeding] = useState({
        date: new Date().toISOString().split('T')[0],
        foodType: '',
        reaction: 'normal',
        notes: ''
    });

    // Загружаем продукты при монтировании
    useEffect(() => {
        fetchFoodProducts();
    }, []);

    const fetchFoodProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/food-products');
            if (response.data.success) {
                setFoodProducts(response.data.products);
                
                // Получаем уникальные категории
                const uniqueCategories = [...new Set(response.data.products.map(p => p.category))];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            console.error('Ошибка загрузки продуктов:', error);
        }
    };

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
                date: newFeeding.date,
                foodType: newFeeding.foodType,
                reaction: newFeeding.reaction,
                notes: newFeeding.notes
            });

            if (response.data.success) {
                const updatedResponse = await axios.get(`http://localhost:5000/api/feeding/child/${child_id}`);
                setFeedingData(updatedResponse.data.feeding);
                
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
            alert('Ошибка при сохранении: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateFeeding = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.put(`http://localhost:5000/api/feeding/${editingId}`, {
                date: newFeeding.date,
                foodType: newFeeding.foodType,
                reaction: newFeeding.reaction,
                notes: newFeeding.notes
            });

            if (response.data.success) {
                const updatedResponse = await axios.get(`http://localhost:5000/api/feeding/child/${child_id}`);
                setFeedingData(updatedResponse.data.feeding);
                
                setEditingId(null);
                setNewFeeding({
                    date: new Date().toISOString().split('T')[0],
                    foodType: '',
                    reaction: 'normal',
                    notes: ''
                });
            }
        } catch (error) {
            console.error('Ошибка при обновлении:', error);
            alert('Ошибка при обновлении: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFeeding = async (feedingId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/feeding/${feedingId}`);
            
            if (response.data.success) {
                setFeedingData(feedingData.filter(item => item.feeding_id !== feedingId));
                setShowDeleteConfirm(null);
            }
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            alert('Ошибка при удалении: ' + (error.response?.data?.message || error.message));
        }
    };

    const startEdit = (item) => {
        setEditingId(item.feeding_id);
        setNewFeeding({
            date: item.date.split('T')[0],
            foodType: item.food_introduced || item.feeding_type,
            reaction: item.reaction || 'normal',
            notes: item.notes || ''
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewFeeding({
            date: new Date().toISOString().split('T')[0],
            foodType: '',
            reaction: 'normal',
            notes: ''
        });
    };

    const getReactionInfo = (reactionValue) => {
        return reactions.find(r => r.value === reactionValue) || reactions[0];
    };

    // Группируем продукты по категориям для удобного отображения
    const productsByCategory = categories.reduce((acc, category) => {
        acc[category] = foodProducts.filter(p => p.category === category);
        return acc;
    }, {});

    return (
        <div className="feeding-container">
            {/* Модальное окно управления продуктами */}
            {showProductManager && (
                <FoodProductManager
                    onClose={() => setShowProductManager(false)}
                    onUpdate={fetchFoodProducts}
                />
            )}

            <div className="section-header">
                <h2 className="section-title">Питание и прикорм</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        className="settings-btn"
                        onClick={() => setShowProductManager(true)}
                        title="Управление продуктами"
                    >
                        <Settings size={16} />
                        Продукты
                    </button>
                    <button 
                        className="add-feeding-btn"
                        onClick={() => setShowAddForm(true)}
                    >
                        <Plus size={16} />
                        Добавить запись
                    </button>
                </div>
            </div>

            {(showAddForm || editingId) && (
                <div className="add-feeding-form">
                    <h3>{editingId ? 'Редактировать запись' : 'Новая запись о питании'}</h3>
                    <form onSubmit={editingId ? handleUpdateFeeding : handleAddFeeding}>
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
                                {categories.map(category => (
                                    <optgroup key={category} label={getCategoryLabel(category)}>
                                        {productsByCategory[category]?.map(product => (
                                            <option key={product.product_id} value={product.name}>
                                                {product.name} {product.is_allergen ? '⚠️' : ''}
                                            </option>
                                        ))}
                                    </optgroup>
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
                                <Save size={16} />
                                {loading ? 'Сохранение...' : 'Сохранить'}
                            </button>
                            <button type="button" className="cancel-btn" onClick={cancelEdit}>
                                <X size={16} />
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="feeding-history">
                {feedingData.length > 0 ? (
                    <div className="feeding-timeline">
                        {feedingData.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item) => {
                            const reaction = getReactionInfo(item.reaction);
                            return (
                                <div key={item.feeding_id} className="feeding-item">
                                    <div className="feeding-date">{formatDate(item.date)}</div>
                                    <div className="feeding-content">
                                        <div className="feeding-header">
                                            <Apple size={16} color="#3498db" />
                                            <span className="feeding-food">{item.food_introduced || item.feeding_type}</span>
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
                                            <div className="feeding-actions">
                                                <button
                                                    onClick={() => startEdit(item)}
                                                    className="icon-btn edit-btn"
                                                    title="Редактировать"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(item.feeding_id)}
                                                    className="icon-btn delete-btn"
                                                    title="Удалить"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        {item.notes && (
                                            <div className="feeding-notes">{item.notes}</div>
                                        )}
                                    </div>

                                    {showDeleteConfirm === item.feeding_id && (
                                        <div className="delete-confirm-overlay">
                                            <div className="delete-confirm-modal">
                                                <p>Удалить запись о питании?</p>
                                                <p className="delete-confirm-details">
                                                    {item.food_introduced || item.feeding_type} - {formatDate(item.date)}
                                                </p>
                                                <div className="delete-confirm-actions">
                                                    <button
                                                        onClick={() => handleDeleteFeeding(item.feeding_id)}
                                                        className="confirm-delete-btn"
                                                    >
                                                        Удалить
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(null)}
                                                        className="cancel-delete-btn"
                                                    >
                                                        Отмена
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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

// Вспомогательная функция для перевода категорий
function getCategoryLabel(category) {
    const labels = {
        'milk': 'Молочные продукты',
        'vegetable': 'Овощи',
        'fruit': 'Фрукты',
        'cereal': 'Каши',
        'meat': 'Мясо',
        'fish': 'Рыба',
        'dairy': 'Кисломолочные',
        'egg': 'Яйца',
        'drink': 'Напитки',
        'nuts': 'Орехи',
        'other': 'Другое'
    };
    return labels[category] || category;
}

export default FeedingTracker;