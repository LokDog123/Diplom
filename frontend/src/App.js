import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddChild from './pages/AddChild';
import ParentProfile from './pages/ParentProfile';
import ChildProfile from './pages/ChildProfile';
import AddMeasurement from './pages/AddMeasurement';


const PrivateRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/add-child" element={
                        <PrivateRoute>
                            <AddChild />
                        </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <ParentProfile />
                        </PrivateRoute>
                    } />
                    <Route path="/child/:child_id" element={
                        <PrivateRoute>
                            <ChildProfile />
                        </PrivateRoute>
                    } />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/child/:child_id/add-measurement" element={
                        <PrivateRoute>
                            <AddMeasurement />
                        </PrivateRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;