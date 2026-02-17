import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Пока закомментируем, так как нет сервера
      // const response = await axios.post('http://localhost:5000/api/login', { email, password });
      // const { token, user } = response.data;
      
      // Временная заглушка для тестирования
      localStorage.setItem('token', 'fake-token');
      axios.defaults.headers.common['Authorization'] = `Bearer fake-token`;
      setUser({ email, name: 'Тестовый пользователь' });
      toast.success('Вход выполнен успешно');
      return true;
    } catch (error) {
      toast.error('Ошибка входа');
      return false;
    }
  };

  const register = async (email, password, name) => {
    try {
      toast.success('Регистрация успешна');
      return true;
    } catch (error) {
      toast.error('Ошибка регистрации');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Выход выполнен');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};