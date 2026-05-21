import React, { useState, useEffect } from 'react';
import { Calendar, Syringe, Plus, X, Save, Edit, Trash2, RefreshCw } from 'lucide-react';
import axios from 'axios';

function VaccinationCalendar({ child_id }) {
    const [vaccinations, setVaccinations] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [stats, setStats] = useState({ completed: 0, upcoming: 0, overdue: 0, completion_rate: 0 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [activeTab, setActiveTab] = useState('history');
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' }); // Состояние для кастомного диалога удаления
    const [formData, setFormData] = useState({
        vaccine_name: '',
        administered_date: '',
        dose_number: 1,
        batch_number: '',
        administered_by: '',
        reaction: 'none',
        notes: ''
    });

    const reactionOptions = [
        { value: 'none', label: 'Нет реакции', color: '#27ae60' },
        { value: 'normal', label: 'Нормальная', color: '#3498db' },
        { value: 'mild', label: 'Легкая (покраснение)', color: '#f39c12' },
        { value: 'moderate', label: 'Средняя (температура до 38°C)', color: '#e67e22' },
        { value: 'severe', label: 'Сильная (температура выше 38°C)', color: '#e74c3c' }
    ];

    useEffect(() => {
        fetchAllData();
    }, [child_id]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            
            const [vaccinationsRes, scheduleRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/vaccinations/child/${child_id}`),
                axios.get(`http://localhost:5000/api/vaccinations/schedule/${child_id}`)
            ]);
            
            setVaccinations(vaccinationsRes.data.vaccinations || []);
            setSchedule(scheduleRes.data.schedule || []);
            setStats(scheduleRes.data.stats || { completed: 0, upcoming: 0, overdue: 0, completion_rate: 0 });
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVaccine = async (e) => {
        e.preventDefault();
        
        if (!formData.vaccine_name.trim()) {
            setError('Введите название прививки');
            return;
        }
        
        setSaving(true);
        
        try {
            const payload = {
                child_id: child_id,
                vaccine_name: formData.vaccine_name.trim(),
                administered_date: formData.administered_date || null,
                dose_number: parseInt(formData.dose_number),
                batch_number: formData.batch_number || null,
                administered_by: formData.administered_by || null,
                reaction: formData.reaction || 'none',
                notes: formData.notes || null
            };
            
            await axios.post('http://localhost:5000/api/vaccinations', payload);
            
            resetForm();
            fetchAllData();
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateVaccine = async (e) => {
        e.preventDefault();
        
        if (!formData.vaccine_name.trim()) {
            setError('Введите название прививки');
            return;
        }
        
        setSaving(true);
        
        try {
            const payload = {
                vaccine_name: formData.vaccine_name.trim(),
                administered_date: formData.administered_date || null,
                dose_number: parseInt(formData.dose_number),
                batch_number: formData.batch_number || null,
                administered_by: formData.administered_by || null,
                reaction: formData.reaction || 'none',
                notes: formData.notes || null,
                is_completed: !!formData.administered_date
            };
            
            await axios.put(`http://localhost:5000/api/vaccinations/${editingId}`, payload);
            
            resetForm();
            fetchAllData();
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setSaving(false);
        }
    };

    // Функция, которая показывает кастомное окно подтверждения
    const confirmDelete = (id, name) => {
        setDeleteConfirm({ show: true, id, name });
    };

    // Функция, которая выполняет удаление
    const handleDeleteVaccine = async () => {
        const { id, name } = deleteConfirm;
        try {
            await axios.delete(`http://localhost:5000/api/vaccinations/${id}`);
            fetchAllData();
            setDeleteConfirm({ show: false, id: null, name: '' }); // Закрываем окно
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setDeleteConfirm({ show: false, id: null, name: '' }); // Закрываем окно даже при ошибке
        }
    };

    const handleEdit = (vaccine) => {
        setEditingId(vaccine.vaccination_id);
        setFormData({
            vaccine_name: vaccine.vaccine_name,
            administered_date: vaccine.administered_date ? vaccine.administered_date.split('T')[0] : '',
            dose_number: vaccine.dose_number || 1,
            batch_number: vaccine.batch_number || '',
            administered_by: vaccine.administered_by || '',
            reaction: vaccine.reaction || 'none',
            notes: vaccine.notes || ''
        });
        setShowAddForm(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setShowAddForm(false);
        setFormData({
            vaccine_name: '',
            administered_date: '',
            dose_number: 1,
            batch_number: '',
            administered_by: '',
            reaction: 'none',
            notes: ''
        });
    };

    const formatDate = (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('ru-RU');
    };

    const getReactionLabel = (reaction) => {
        const option = reactionOptions.find(r => r.value === reaction);
        return option ? option.label : reaction;
    };

    const getReactionColor = (reaction) => {
        const option = reactionOptions.find(r => r.value === reaction);
        return option ? option.color : '#7f8c8d';
    };

    const StatCard = ({ title, value, color, bg }) => (
        <div style={{ background: bg || `${color}20`, borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: color }}>{value}</div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{title}</div>
        </div>
    );

    if (loading) {
        return <div style={{ padding: '30px', textAlign: 'center' }}>Загрузка...</div>;
    }

    return (
        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
            {/* Заголовок */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h2 style={{ margin: 0, fontSize: '24px' }}>Календарь прививок</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={fetchAllData} style={{ padding: '8px 16px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <RefreshCw size={16} /> Обновить
                    </button>
                    <button onClick={() => { resetForm(); setShowAddForm(true); }} style={{ padding: '8px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Plus size={16} /> Добавить прививку
                    </button>
                </div>
            </div>

            {/* Статистика */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                <StatCard title="Сделано прививок" value={stats.completed || 0} color="#27ae60" />
                <StatCard title="Предстоит" value={stats.upcoming || 0} color="#3498db" />
                <StatCard title="Просрочено" value={stats.overdue || 0} color="#e74c3c" />
                <StatCard title="Выполнение" value={`${stats.completion_rate || 0}%`} color="#f39c12" />
            </div>

            {/* Вкладки */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid var(--border)' }}>
                <button onClick={() => setActiveTab('history')} style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', color: activeTab === 'history' ? '#3498db' : 'var(--text-secondary)', borderBottom: activeTab === 'history' ? '2px solid #3498db' : 'none' }}>
                    <Syringe size={16} style={{ display: 'inline', marginRight: '8px' }} /> История прививок
                </button>
                <button onClick={() => setActiveTab('schedule')} style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', color: activeTab === 'schedule' ? '#3498db' : 'var(--text-secondary)', borderBottom: activeTab === 'schedule' ? '2px solid #3498db' : 'none' }}>
                    <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} /> Календарь
                </button>
            </div>

            {/* Ошибка */}
            {error && (
                <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                    ❌ {error}
                </div>
            )}

            {/* Форма добавления/редактирования */}
            {showAddForm && (
                <div style={{ 
                    background: '#f9f9f9', 
                    borderRadius: '16px', 
                    padding: '25px', 
                    marginBottom: '25px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>
                        {editingId ? '✏️ Редактировать прививку' : '➕ Добавить прививку'}
                    </h3>
                    
                    <form onSubmit={editingId ? handleUpdateVaccine : handleAddVaccine}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                                Название прививки <span style={{ color: '#e74c3c' }}>*</span>
                            </label>
                            <input 
                                type="text" 
                                value={formData.vaccine_name} 
                                onChange={(e) => setFormData({...formData, vaccine_name: e.target.value})} 
                                required 
                                style={{ 
                                    width: '100%', 
                                    padding: '12px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #ddd',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }} 
                                placeholder="Например: АКДС, Корь, краснуха, паротит..." 
                            />
                        </div>

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr', 
                            gap: '20px', 
                            marginBottom: '20px' 
                        }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                                    Дата выполнения
                                </label>
                                <input 
                                    type="date" 
                                    value={formData.administered_date} 
                                    onChange={(e) => setFormData({...formData, administered_date: e.target.value})} 
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        borderRadius: '8px', 
                                        border: '1px solid #ddd',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                                    Номер дозы
                                </label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="10" 
                                    value={formData.dose_number} 
                                    onChange={(e) => setFormData({...formData, dose_number: e.target.value})} 
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        borderRadius: '8px', 
                                        border: '1px solid #ddd',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }} 
                                />
                            </div>
                        </div>

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr', 
                            gap: '20px', 
                            marginBottom: '20px' 
                        }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                                    Серия / № партии
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.batch_number} 
                                    onChange={(e) => setFormData({...formData, batch_number: e.target.value})} 
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        borderRadius: '8px', 
                                        border: '1px solid #ddd',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }} 
                                    placeholder="Пример: 123456" 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                                    Где сделана / Кто делал
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.administered_by} 
                                    onChange={(e) => setFormData({...formData, administered_by: e.target.value})} 
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        borderRadius: '8px', 
                                        border: '1px solid #ddd',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }} 
                                    placeholder="Поликлиника №5, медсестра Иванова" 
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                                Реакция на прививку
                            </label>
                            <select 
                                value={formData.reaction} 
                                onChange={(e) => setFormData({...formData, reaction: e.target.value})} 
                                style={{ 
                                    width: '100%', 
                                    padding: '12px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #ddd',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                    backgroundColor: 'white'
                                }}
                            >
                                {reactionOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                                Заметки
                            </label>
                            <textarea 
                                value={formData.notes} 
                                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                                rows="3" 
                                style={{ 
                                    width: '100%', 
                                    padding: '12px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #ddd',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }} 
                                placeholder="Дополнительная информация о прививке..." 
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
                            <button 
                                type="button" 
                                onClick={resetForm} 
                                style={{ 
                                    padding: '10px 24px', 
                                    background: '#95a5a6', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                <X size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> 
                                Отмена
                            </button>
                            <button 
                                type="submit" 
                                disabled={saving} 
                                style={{ 
                                    padding: '10px 24px', 
                                    background: saving ? '#95a5a6' : '#27ae60', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                <Save size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> 
                                {saving ? 'Сохранение...' : 'Сохранить'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* История прививок */}
            {activeTab === 'history' && (
                <div>
                    {vaccinations.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Дата</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Прививка</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Доза</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Серия</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Реакция</th>
                                        <th style={{ padding: '12px', textAlign: 'center' }}>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vaccinations.map(vac => (
                                        <tr key={vac.vaccination_id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '12px' }}>{formatDate(vac.administered_date)}</td>
                                            <td style={{ padding: '12px' }}><strong>{vac.vaccine_name}</strong></td>
                                            <td style={{ padding: '12px' }}>{vac.dose_number}</td>
                                            <td style={{ padding: '12px' }}>{vac.batch_number || '—'}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ color: getReactionColor(vac.reaction), background: `${getReactionColor(vac.reaction)}20`, padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                                                    {getReactionLabel(vac.reaction)}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <button onClick={() => handleEdit(vac)} style={{ background: '#f39c12', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', marginRight: '8px', cursor: 'pointer' }}>
                                                    <Edit size={14} style={{ display: 'inline', marginRight: '4px' }} /> Ред.
                                                </button>
                                                {/* Измененная кнопка удаления - вызывает confirmDelete вместо прямого вызова */}
                                                <button onClick={() => confirmDelete(vac.vaccination_id, vac.vaccine_name)} style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>
                                                    <Trash2 size={14} style={{ display: 'inline', marginRight: '4px' }} /> Уд.
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Syringe size={48} color="#cbd5e0" />
                            <p>Нет записей о прививках</p>
                            <button onClick={() => { resetForm(); setShowAddForm(true); }} style={{ padding: '8px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>
                                <Plus size={16} /> Добавить первую прививку
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Календарь прививок */}
            {activeTab === 'schedule' && (
                <div>
                    {schedule.length > 0 ? (
                        schedule.map((vaccine, idx) => (
                            <div key={idx} style={{ background: '#f9f9f9', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{vaccine.vaccine_name}</div>
                                        <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '4px' }}>
                                            {vaccine.scheduled_age_description} • Доза {vaccine.dose_number}
                                        </div>
                                    </div>
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: vaccine.status === 'completed' ? '#27ae60' : 
                                               vaccine.status === 'overdue' ? '#e74c3c' : 
                                               vaccine.status === 'upcoming' ? '#f39c12' : '#95a5a6' 
                                    }}>
                                        {vaccine.status === 'completed' ? '✅ Сделана' : 
                                         vaccine.status === 'overdue' ? '⚠️ Просрочена' : 
                                         vaccine.status === 'upcoming' ? '🔜 Скоро' : '⏳ Ожидает'}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Calendar size={48} color="#cbd5e0" />
                            <p>Календарь прививок пуст</p>
                        </div>
                    )}
                </div>
            )}

            {/* Кастомное модальное окно для подтверждения удаления */}
            {deleteConfirm.show && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        width: '90%',
                        maxWidth: '400px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px' }}>
                            Подтвердите действие
                        </h3>
                        <p style={{ marginBottom: '24px', fontSize: '16px', color: '#333' }}>
                            Удалить прививку <strong>"{deleteConfirm.name}"</strong>?
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setDeleteConfirm({ show: false, id: null, name: '' })}
                                style={{
                                    padding: '8px 20px',
                                    background: '#95a5a6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleDeleteVaccine}
                                style={{
                                    padding: '8px 20px',
                                    background: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VaccinationCalendar;