import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <button
            onClick={toggleTheme}
            style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                transition: 'all 0.3s',
            }}
            title={isDark ? 'Светлая тема' : 'Темная тема'}
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>
                {isDark ? 'Светлая' : 'Темная'}
            </span>
        </button>
    );
}

export default ThemeToggle;