import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Baby, User, Calendar, Activity, Edit, Trash2, Plus, Save, X } from 'lucide-react';

function ChildHeader({ 
    child, 
    child_id, 
    isEditing, 
    editForm, 
    setEditForm, 
    setIsEditing, 
    setShowDeleteConfirm, 
    handleEditSubmit,
    formatDate 
}) {
    const calculateAge = (birthDate) => {
        if (!birthDate) return 'Не указан';
        const today = new Date();
        const birth = new Date(birthDate);
        const months = (today.getFullYear() - birth.getFullYear()) * 12 + 
                      (today.getMonth() - birth.getMonth());
        
        if (months < 0) return '0 мес';
        if (months >= 12) {
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            return remainingMonths > 0 ? `${years} лет ${remainingMonths} мес` : `${years} лет`;
        }
        return `${months} мес`;
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                <Link to="/dashboard" className="back-link">
                    <ArrowLeft size={20} />
                    Назад
                </Link>
                
                {!isEditing ? (
                    <div className="child-info">
                        <div className={`child-avatar ${child.gender === 'male' ? 'male' : 'female'}`}>
                            <Baby size={30} color="white" />
                        </div>
                        
                        <div>
                            <h1 className="child-name">{child.name}</h1>
                            <div className="child-details">
                                <span>
                                    <User size={14} />
                                    Пол: {child.gender === 'male' ? 'Мальчик' : 'Девочка'}
                                </span>
                                <span>
                                    <Calendar size={14} />
                                    Дата рождения: {formatDate(child.birth_date)}
                                </span>
                                <span>
                                    <Activity size={14} />
                                    Возраст: {calculateAge(child.birth_date)}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleEditSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center', flex: 1 }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                                placeholder="Имя ребенка"
                                style={{
                                    padding: '8px 12px',
                                    border: '2px solid #3498db',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                                required
                            />
                            <input
                                type="date"
                                name="birth_date"
                                value={editForm.birth_date}
                                onChange={handleEditChange}
                                style={{
                                    padding: '8px 12px',
                                    border: '2px solid #3498db',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                                required
                            />
                            <select
                                name="gender"
                                value={editForm.gender}
                                onChange={handleEditChange}
                                style={{
                                    padding: '8px 12px',
                                    border: '2px solid #3498db',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                            >
                                <option value="male">Мальчик</option>
                                <option value="female">Девочка</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="action-button save"
                        >
                            <Save size={16} />
                            Сохранить
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="action-button cancel"
                        >
                            <X size={16} />
                            Отмена
                        </button>
                    </form>
                )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                {!isEditing && (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="action-button edit"
                        >
                            <Edit size={16} />
                            Редактировать
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="action-button delete"
                        >
                            <Trash2 size={16} />
                            Удалить
                        </button>
                    </>
                )}
                <Link to={`/child/${child_id}/add-measurement`} className="add-measurement-btn">
                    <Plus size={20} />
                    Добавить замер
                </Link>
            </div>
        </header>
    );
}

export default ChildHeader;