import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, AlertCircle } from 'lucide-react';
import axios from 'axios';

function FoodProductManager({ onClose, onUpdate }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'other',
        description: '',
        recommended_age_months: '',
        is_allergen: false,
        notes: ''
    });

    const categoryOptions = [
        { value: 'milk', label: '🥛 Молочные продукты' },
        { value: 'vegetable', label: '🥕 Овощи' },
        { value: 'fruit', label: '🍎 Фрукты' },
        { value: 'cereal', label: '🌾 Каши' },
        { value: 'meat', label: '🥩 Мясо' },
        { value: 'fish', label: '🐟 Рыба' },
        { value: 'dairy', label: '🧀 Кисломолочные' },
        { value: 'egg', label: '🥚 Яйца' },
        { value: 'drink', label: '🧃 Напитки' },
        { value: 'nuts', label: '🥜 Орехи' },
        { value: 'other', label: '📦 Другое' }
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/food-products');
            if (response.data.success) {
                setProducts(response.data.products);
                
                // Получаем категории
                const catsResponse = await axios.get('http://localhost:5000/api/food-products/categories');
                if (catsResponse.data.success) {
                    setCategories(catsResponse.data.categories);
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки продуктов:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/food-products/${editingId}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/food-products', formData);
            }

            await fetchProducts();
            if (onUpdate) onUpdate();
            
            resetForm();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Ошибка при сохранении: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/api/food-products/${productId}`);
            await fetchProducts();
            if (onUpdate) onUpdate();
            setShowDeleteConfirm(null);
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('Ошибка при удалении: ' + (error.response?.data?.message || error.message));
        }
    };

    const startEdit = (product) => {
        setEditingId(product.product_id);
        setFormData({
            name: product.name,
            category: product.category,
            description: product.description || '',
            recommended_age_months: product.recommended_age_months || '',
            is_allergen: product.is_allergen || false,
            notes: product.notes || ''
        });
        setShowAddForm(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setShowAddForm(false);
        setFormData({
            name: '',
            category: 'other',
            description: '',
            recommended_age_months: '',
            is_allergen: false,
            notes: ''
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
                <div className="modal-header">
                    <h2>Управление продуктами питания</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {!showAddForm ? (
                        <>
                            <div className="section-header">
                                <h3>Список продуктов</h3>
                                <button
                                    className="add-product-btn"
                                    onClick={() => setShowAddForm(true)}
                                >
                                    <Plus size={16} />
                                    Добавить продукт
                                </button>
                            </div>

                            <div className="products-grid">
                                {products.map(product => (
                                    <div key={product.product_id} className="product-card">
                                        <div className="product-header">
                                            <span className="product-name">{product.name}</span>
                                            {product.is_allergen && (
                                                <span className="allergen-badge" title="Аллерген">
                                                    <AlertCircle size={14} color="#e74c3c" />
                                                </span>
                                            )}
                                        </div>
                                        <div className="product-category">
                                            {categoryOptions.find(c => c.value === product.category)?.label}
                                        </div>
                                        {product.recommended_age_months && (
                                            <div className="product-age">
                                                С {product.recommended_age_months} мес
                                            </div>
                                        )}
                                        <div className="product-actions">
                                            <button
                                                onClick={() => startEdit(product)}
                                                className="icon-btn edit-btn"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(product.product_id)}
                                                className="icon-btn delete-btn"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="product-form">
                            <h3>{editingId ? 'Редактировать продукт' : 'Новый продукт'}</h3>

                            <div className="form-group">
                                <label>Название продукта *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Категория</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    {categoryOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Описание</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="2"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Рекомендуемый возраст (мес)</label>
                                    <input
                                        type="number"
                                        name="recommended_age_months"
                                        value={formData.recommended_age_months}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="60"
                                    />
                                </div>

                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="is_allergen"
                                            checked={formData.is_allergen}
                                            onChange={handleInputChange}
                                        />
                                        Является аллергеном
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Заметки</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows="2"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="save-btn" disabled={loading}>
                                    <Save size={16} />
                                    {loading ? 'Сохранение...' : 'Сохранить'}
                                </button>
                                <button type="button" className="cancel-btn" onClick={resetForm}>
                                    <X size={16} />
                                    Отмена
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-modal">
                        <p>Удалить продукт?</p>
                        <p className="delete-confirm-details">
                            {products.find(p => p.product_id === showDeleteConfirm)?.name}
                        </p>
                        <div className="delete-confirm-actions">
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
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
}

export default FoodProductManager;