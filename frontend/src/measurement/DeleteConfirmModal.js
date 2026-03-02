import React from 'react';
import { Trash2 } from 'lucide-react';

function DeleteConfirmModal({ show, childName, onConfirm, onCancel }) {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <Trash2 size={48} color="#e74c3c" className="modal-icon" />
                <h3 className="modal-title">Удалить профиль ребенка?</h3>
                <p className="modal-text">
                    Вы уверены, что хотите удалить профиль {childName}? 
                    Все замеры также будут удалены. Это действие нельзя отменить.
                </p>
                <div className="modal-actions">
                    <button
                        onClick={onConfirm}
                        className="modal-button confirm-delete"
                    >
                        Да, удалить
                    </button>
                    <button
                        onClick={onCancel}
                        className="modal-button cancel"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;