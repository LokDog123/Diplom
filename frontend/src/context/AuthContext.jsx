// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const value = {
        user,
        loading,
        register
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};