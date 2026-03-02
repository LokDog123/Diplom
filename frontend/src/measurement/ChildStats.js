import React from 'react';
import { Ruler, Weight, Activity } from 'lucide-react';

function ChildStats({ measurements }) {
    const lastMeasurement = measurements[measurements.length - 1];

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-content">
                    <div className="stat-icon height">
                        <Ruler size={20} color="#3498db" />
                    </div>
                    <div>
                        <div className="stat-label">Последний рост</div>
                        <div className="stat-value">
                            {lastMeasurement?.height || '—'} см
                        </div>
                    </div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-content">
                    <div className="stat-icon weight">
                        <Weight size={20} color="#27ae60" />
                    </div>
                    <div>
                        <div className="stat-label">Последний вес</div>
                        <div className="stat-value">
                            {lastMeasurement?.weight || '—'} кг
                        </div>
                    </div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-content">
                    <div className="stat-icon activity">
                        <Activity size={20} color="#e67e22" />
                    </div>
                    <div>
                        <div className="stat-label">Всего замеров</div>
                        <div className="stat-value">{measurements.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChildStats;