import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../schemas/validationSchemas';
import { Baby, AlertCircle } from 'lucide-react';

function Register() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            lastname: '',
            email: '',
            phone: '',
            birth_date: '',
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data) => {
        const success = await registerUser(
            data.name,
            data.lastname,
            data.email,
            data.password,
            data.confirmPassword,
            data.phone,
            data.birth_date
        );
        if (success) {
            alert('Регистрация успешна!');
            navigate('/login');
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
                maxWidth: '500px',
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
                    <h1 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '10px' }}>
                        ChildGrowth Tracker
                    </h1>
                    <p style={{ color: '#64748b' }}>Создайте новый аккаунт</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: '500' }}>
                            Имя <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="text"
                            {...register('name')}
                            autoComplete="given-name"
                            placeholder="Иван"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: `2px solid ${errors.name ? '#ef4444' : '#e2e8f0'}`,
                                borderRadius: '12px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#1e293b',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => {
                                if (!errors.name) e.target.style.borderColor = '#e2e8f0';
                            }}
                        />
                        {errors.name && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                marginTop: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <AlertCircle size={12} />
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: '500' }}>
                            Фамилия <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="text"
                            {...register('lastname')}
                            autoComplete="family-name"
                            placeholder="Петров"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: `2px solid ${errors.lastname ? '#ef4444' : '#e2e8f0'}`,
                                borderRadius: '12px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#1e293b',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => {
                                if (!errors.lastname) e.target.style.borderColor = '#e2e8f0';
                            }}
                        />
                        {errors.lastname && (
                            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
                                {errors.lastname.message}
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: '500' }}>
                            Email <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="email"
                            {...register('email')}
                            autoComplete="email"
                            placeholder="your@email.com"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: `2px solid ${errors.email ? '#ef4444' : '#e2e8f0'}`,
                                borderRadius: '12px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#1e293b',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => {
                                if (!errors.email) e.target.style.borderColor = '#e2e8f0';
                            }}
                        />
                        {errors.email && (
                            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: '500' }}>
                            Телефон
                        </label>
                        <input
                            type="tel"
                            {...register('phone')}
                            autoComplete="tel"
                            placeholder="+375 (29) 999-99-99"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: `2px solid ${errors.phone ? '#ef4444' : '#e2e8f0'}`,
                                borderRadius: '12px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#1e293b',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => {
                                if (!errors.phone) e.target.style.borderColor = '#e2e8f0';
                            }}
                        />
                        {errors.phone && (
                            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: '500' }}>
                            Дата рождения
                        </label>
                        <input
                            type="date"
                            {...register('birth_date')}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: `2px solid ${errors.birth_date ? '#ef4444' : '#e2e8f0'}`,
                                borderRadius: '12px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#1e293b',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => {
                                if (!errors.birth_date) e.target.style.borderColor = '#e2e8f0';
                            }}
                        />
                        {errors.birth_date && (
                            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
                                {errors.birth_date.message}
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: '500' }}>
                            Пароль <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="password"
                            {...register('password')}
                            autoComplete="new-password"
                            placeholder="Минимум 8 символов"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: `2px solid ${errors.password ? '#ef4444' : '#e2e8f0'}`,
                                borderRadius: '12px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#1e293b',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => {
                                if (!errors.password) e.target.style.borderColor = '#e2e8f0';
                            }}
                        />
                        {errors.password && (
                            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: '500' }}>
                            Подтвердите пароль <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="password"
                            {...register('confirmPassword')}
                            autoComplete="new-password"
                            placeholder="Повторите пароль"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: `2px solid ${errors.confirmPassword ? '#ef4444' : '#e2e8f0'}`,
                                borderRadius: '12px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#1e293b',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => {
                                if (!errors.confirmPassword) e.target.style.borderColor = '#e2e8f0';
                            }}
                        />
                        {errors.confirmPassword && (
                            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: isSubmitting ? '#94a3b8' : '#3498db',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            marginBottom: '20px',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (!isSubmitting) e.target.style.background = '#2980b9';
                        }}
                        onMouseLeave={(e) => {
                            if (!isSubmitting) e.target.style.background = '#3498db';
                        }}
                    >
                        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>

                    <p style={{ textAlign: 'center', color: '#64748b' }}>
                        Уже есть аккаунт?{' '}
                        <Link to="/login" style={{ color: '#3498db', textDecoration: 'none', fontWeight: '500' }}>
                            Войти
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;