import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
    const styles = {
        card: {
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
            border: '1px solid #e0e6ed'
        },
        chart: {
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            border: '1px solid #e0e6ed'
        },
        line: {
            height: '20px',
            background: 'linear-gradient(90deg, #f0f4f8 25%, #e0e6ed 50%, #f0f4f8 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px',
            marginBottom: '15px'
        },
        circle: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(90deg, #f0f4f8 25%, #e0e6ed 50%, #f0f4f8 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
        }
    };

    const renderSkeleton = () => {
        if (type === 'card') {
            return (
                <div style={styles.card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={styles.circle}></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ ...styles.line, width: '60%' }}></div>
                            <div style={{ ...styles.line, width: '40%' }}></div>
                        </div>
                    </div>
                    <div style={{ ...styles.line, width: '80%' }}></div>
                    <div style={{ ...styles.line, width: '50%' }}></div>
                </div>
            );
        }
        
        if (type === 'chart') {
            return (
                <div style={styles.chart}>
                    <div style={{ ...styles.line, width: '30%', height: '30px' }}></div>
                    <div style={{ ...styles.line, width: '100%', height: '300px' }}></div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <div style={{ ...styles.line, width: '80px', height: '35px' }}></div>
                        <div style={{ ...styles.line, width: '80px', height: '35px' }}></div>
                        <div style={{ ...styles.line, width: '80px', height: '35px' }}></div>
                    </div>
                </div>
            );
        }

        if (type === 'stat') {
            return (
                <div style={styles.card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', ...styles.line }}></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ ...styles.line, width: '50%', height: '12px' }}></div>
                            <div style={{ ...styles.line, width: '70%', height: '24px' }}></div>
                        </div>
                    </div>
                </div>
            );
        }
        
        return <div style={styles.line}></div>;
    };

    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {Array(count).fill().map((_, i) => (
                    <div key={i}>{renderSkeleton()}</div>
                ))}
            </div>
        </>
    );
};

export default SkeletonLoader;