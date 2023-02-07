import React, { Component, lazy } from 'react';
import { Routes, Route } from "react-router-dom";

//Pages
const HomePage = lazy(() => import('../pages/home-page'));
const LoginPage = lazy(() => import("../pages/login-page"));
const NotFoundPage = lazy(() => import("../pages/not-found-page"));

//User
//const AuthContainer = lazy(() => import("./screens/User/AuthContainer"));

//Content
//const CarsList = lazy(() => import("./screens/Content/Blog/Posts/Pellerex-Overview"));
//const DriversList = lazy(() => import("./screens/Content/Blog/BlogList"));    
//const UsersList = lazy(() => import("./screens/Content/Blog/Posts/API/UrlRewrite"));

const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage />}/>                
            <Route path='/login' element={<LoginPage />}/>                
            <Route path='*' element={<NotFoundPage/>}/>
        </Routes>
    );
}

export default AppRouter;
