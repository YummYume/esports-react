import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Header from './layout/Header';
import Main from './Main';
import Login from './Login';
import Menu from './logged/Menu';
import { getUserWithToken } from './API/user';

export default function App() {
    const [user, setUser] = useState(false);

    const updateUser = () => {
        getUserWithToken(JSON.parse(localStorage.getItem('userToken'))).then((userData) => {
            setUser(userData);
        });
    };

    useEffect(() => {
        updateUser();
    }, []);

    return (
        <div id="app">
            <Header user={user} updateUser={updateUser} />
            <Routes>
                <Route exact path="/" element={<Main user={user} />} />
                <Route exact path="login" element={<Login updateUser={updateUser} />} />
                <Route exact path="menu" element={<Menu updateUser={updateUser} />} />
            </Routes>
        </div>
    );
}
