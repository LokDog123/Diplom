import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Функция регистрации
    const register = async (name, lastname, email, password, confirmPassword) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                name,
                lastname,
                email,
                password,
                confirmPassword
            });
            
            if (response.data.success) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.response?.data?.message || 'Ошибка регистрации');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email,
                password
            });
            
            if (response.data.success) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            alert(error.response?.data?.message || 'Ошибка входа');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const value = {
        user,
        loading,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};