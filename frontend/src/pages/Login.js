import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Baby } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Заполните все поля');
            return;
        }

        setError('');
        setLoading(true);

        const success = await login(email, password);

        setLoading(false);

        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: '#f5f7fa'
        }}>
            <div style={{
                maxWidth: '400px',
                width: '100%',
                padding: '40px',
                background: '#ffffff',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
                position: 'relative'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <Baby size={48} color="#3498db" style={{ marginBottom: '15px' }} />

                    <h1 style={{
                        fontSize: '24px',
                        color: '#1e293b',
                        marginBottom: '10px'
                    }}>
                        ChildGrowth Tracker
                    </h1>

                    <p style={{ color: '#64748b' }}>
                        Войдите в свой аккаунт
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        padding: '12px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        textAlign: 'center',
                        border: '1px solid #ef4444',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#475569',
                            fontWeight: '500'
                        }}>
                            Email
                        </label>

                        <input
                            type="email"
                            autoComplete="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#1e293b',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#475569',
                            fontWeight: '500'
                        }}>
                            Пароль
                        </label>

                        <input
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#1e293b',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading ? '#94a3b8' : '#3498db',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.target.style.background = '#2980b9';
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.target.style.background = '#3498db';
                        }}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '24px',
                    color: '#64748b'
                }}>
                    Нет аккаунта?{' '}
                    <Link
                        to="/register"
                        style={{
                            color: '#3498db',
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;