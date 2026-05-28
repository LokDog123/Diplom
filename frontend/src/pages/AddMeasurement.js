import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader, Calendar, Ruler, Weight, Circle, FileText } from 'lucide-react';
import axios from 'axios';
import './AddMeasurement.css';

function AddMeasurement() {
    const { child_id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        height: '',
        weight: '',
        headCircumference: '',
        notes: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.height || !formData.weight) {
            setError('Заполните рост и вес');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const payload = {
                child_id: child_id,
                date: formData.date,
                height: parseFloat(formData.height),
                weight: parseFloat(formData.weight),
                head_circumference: formData.headCircumference ? parseFloat(formData.headCircumference) : null,
                notes: formData.notes || null
            };
            
            const response = await axios.post('http://localhost:5000/api/measurements', payload);
            
            if (response.status === 200 || response.status === 201 || response.data.success) {
                navigate(`/child/${child_id}`);
            } else {
                setError('Ошибка при сохранении');
            }
        } catch (err) {
            console.error('Ошибка:', err);
            setError(err.response?.data?.message || 'Ошибка сервера');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-measurement-page">
            <div className="add-measurement-container">
                <Link to={`/child/${child_id}`} className="back-link">
                    <ArrowLeft size={20} />
                    Назад
                </Link>
                
                <h1 className="page-title">Добавить замер</h1>

                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="measurement-form">
                    {/* Поле Дата */}
                    <div className="form-group">
                        <label className="form-label">
                            <Calendar size={18} />
                            Дата <span className="required">*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    {/* Рост и Вес в одну строку */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <Ruler size={18} />
                                Рост (см) <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                className="form-input"
                                step="0.1"
                                placeholder="75.5"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">
                                <Weight size={18} />
                                Вес (кг) <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                className="form-input"
                                step="0.01"
                                placeholder="9.2"
                                required
                            />
                        </div>
                    </div>

                    {/* Окружность головы */}
                    <div className="form-group">
                        <label className="form-label">
                            <Circle size={18} />
                             Окружность головы (см)
                        </label>
                        <input
                            type="number"
                            name="headCircumference"
                            value={formData.headCircumference}
                            onChange={handleChange}
                            className="form-input"
                            step="0.1"
                            placeholder="45"
                        />
                    </div>

                    {/* Заметки */}
                    <div className="form-group">
                        <label className="form-label">
                            <FileText size={18} />
                            Заметки
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="Дополнительная информация..."
                        />
                    </div>

                    {/* Кнопки */}
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? <Loader size={18} /> : <Save size={18} />}
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        
                        <Link 
                            to={`/child/${child_id}`}
                            className="cancel-btn"
                        >
                            Отмена
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddMeasurement;