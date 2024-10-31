import React from 'react'
import { Routes, Route } from 'react-router-dom';
import App from './App.jsx'
import PageNotFound from './Pages/PageNotFound.jsx';
import Register from './Pages/Register.jsx';
import Login from './Pages/Login.jsx';
import TaskShare from './Pages/TaskShare.jsx'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/task/:taskId" element={<TaskShare />} />
    </Routes>
  )
}

export default AppRoutes;