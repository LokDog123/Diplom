import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChildHeader from '../measurement/ChildHeader';
import ChildStats from '../measurement/ChildStats';
import ChildCharts from '../measurement/ChildCharts';
import MeasurementsHistory from '../measurement/MeasurementsHistory';
import FeedingTracker from '../measurement/FeedingTracker';
import HealthTracker from '../measurement/HealthTracker';
import WeightAnalytics from '../measurement/WeightAnalytics';
import DeleteConfirmModal from '../measurement/DeleteConfirmModal';
import './ChildProfile.css';

function ChildProfile() {
    const { child_id } = useParams();
    const navigate = useNavigate();
    const [child, setChild] = useState(null);
    const [measurements, setMeasurements] = useState([]);
    const [feedingData, setFeedingData] = useState([]);
    const [healthData, setHealthData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChart, setActiveChart] = useState('height');
    const [activeTab, setActiveTab] = useState('measurements'); // 'measurements', 'feeding', 'health', 'weight'
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        birth_date: '',
        gender: 'male'
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const calculateAgeWithPrecision = useCallback((measureDate, birthDate) => {
        if (!birthDate) return 0;
        const birth = new Date(birthDate);
        const meas = new Date(measureDate);
        const months = (meas.getFullYear() - birth.getFullYear()) * 12 + 
                      (meas.getMonth() - birth.getMonth());
        return months;
    }, []);

    const fetchChildData = useCallback(async () => {
        try {
            // Загружаем данные ребенка
            const childResponse = await axios.get(`http://localhost:5000/api/children/${child_id}`);
            if (childResponse.data.success) {
                setChild(childResponse.data.child);
                setEditForm({
                    name: childResponse.data.child.name,
                    birth_date: childResponse.data.child.birth_date.split('T')[0],
                    gender: childResponse.data.child.gender
                });
            }

            // Загружаем замеры
            const measurementsResponse = await axios.get(`http://localhost:5000/api/measurements/child/${child_id}`);
            if (measurementsResponse.data.success) {
                const sortedMeasurements = measurementsResponse.data.measurements.sort((a, b) => 
                    new Date(a.date) - new Date(b.date)
                );
                setMeasurements(sortedMeasurements);
            }

            // Загружаем данные о питании
            const feedingResponse = await axios.get(`http://localhost:5000/api/feeding/child/${child_id}`);
            if (feedingResponse.data.success) {
                setFeedingData(feedingResponse.data.feeding);
            }

            // Загружаем данные о здоровье
            const healthResponse = await axios.get(`http://localhost:5000/api/health/child/${child_id}`);
            if (healthResponse.data.success) {
                setHealthData(healthResponse.data.health);
            }

        } catch (error) {
            console.error('Ошибка загрузки:', error);
        } finally {
            setLoading(false);
        }
    }, [child_id]);

    useEffect(() => {
        fetchChildData();
    }, [fetchChildData]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/children/${child_id}`, {
                name: editForm.name,
                birth_date: editForm.birth_date,
                gender: editForm.gender
            });

            if (response.data.success) {
                setChild({
                    ...child,
                    name: editForm.name,
                    birth_date: editForm.birth_date,
                    gender: editForm.gender
                });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Ошибка при обновлении:', error);
            alert('Ошибка при обновлении данных ребенка');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/children/${child_id}`);
            if (response.data.success) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            alert('Ошибка при удалении ребенка');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (!child) {
        return (
            <div className="not-found">
                <h2>Ребенок не найден</h2>
                <Link to="/dashboard" className="not-found-link">Вернуться к списку детей</Link>
            </div>
        );
    }

    return (
        <div className="container">
            <ChildHeader
                child={child}
                child_id={child_id}
                isEditing={isEditing}
                editForm={editForm}
                setEditForm={setEditForm}
                setIsEditing={setIsEditing}
                setShowDeleteConfirm={setShowDeleteConfirm}
                handleEditSubmit={handleEditSubmit}
                formatDate={formatDate}
            />

            <DeleteConfirmModal
                show={showDeleteConfirm}
                childName={child.name}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />

            {/* Вкладки навигации */}
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'measurements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('measurements')}
                >
                    Замеры
                </button>
                <button
                    className={`tab-button ${activeTab === 'weight' ? 'active' : ''}`}
                    onClick={() => setActiveTab('weight')}
                >
                    Анализ веса
                </button>
                <button
                    className={`tab-button ${activeTab === 'feeding' ? 'active' : ''}`}
                    onClick={() => setActiveTab('feeding')}
                >
                    Питание
                </button>
                <button
                    className={`tab-button ${activeTab === 'health' ? 'active' : ''}`}
                    onClick={() => setActiveTab('health')}
                >
                    Здоровье
                </button>
            </div>

            {activeTab === 'measurements' && (
                <>
                    <ChildStats measurements={measurements} />
                    
                    <ChildCharts
                        measurements={measurements}
                        child={child}
                        activeChart={activeChart}
                        setActiveChart={setActiveChart}
                        calculateAgeWithPrecision={calculateAgeWithPrecision}
                        formatDate={formatDate}
                    />

                    <MeasurementsHistory
                        measurements={measurements}
                        child={child}
                        child_id={child_id}
                        calculateAgeWithPrecision={calculateAgeWithPrecision}
                        formatDate={formatDate}
                    />
                </>
            )}

            {activeTab === 'weight' && (
                <WeightAnalytics
                    measurements={measurements}
                    child={child}
                    calculateAgeWithPrecision={calculateAgeWithPrecision}
                    formatDate={formatDate}
                />
            )}

            {activeTab === 'feeding' && (
                <FeedingTracker
                    child_id={child_id}
                    feedingData={feedingData}
                    setFeedingData={setFeedingData}
                    formatDate={formatDate}
                />
            )}

            {activeTab === 'health' && (
                <HealthTracker
                    child_id={child_id}
                    healthData={healthData}
                    setHealthData={setHealthData}
                    formatDate={formatDate}
                />
            )}
        </div>
    );
}

export default ChildProfile;