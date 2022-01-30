import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Header from '../components/layout/Header';
import Main from './Main';
import Login from './Login';
import Menu from './Menu';
import Players from './Players';
import NotFound from './NotFound';
import { getUserWithToken } from '../api/user';
import PacmanLoader from "react-spinners/PacmanLoader";

import styles from '../styles/App.module.scss';

export default function App() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(false);

    const updateUser = () => {
        setLoading(true);

        getUserWithToken(JSON.parse(localStorage.getItem('userToken'))).then((userData) => {
            setUser(userData);
        }).catch((error) => {
            console.error(`Error during updateUser (App) : ${error}`);
        }).finally(() => {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        });
    };

    useEffect(() => {
        updateUser();
    }, []);

    return (
        <div id="app">
            <PacmanLoader color="cyan" loading={loading} css="position:absolute;left:45%;transform:translate(-55%, 0);z-index:100;" size={75} />
            {loading && <div className={styles.loading} />}
            <Header user={user} updateUser={updateUser} loading={loading} />
            <Routes>
                <Route path="/" element={<Main user={user} />} />
                <Route path="/login" element={<Login updateUser={updateUser} />} />
                <Route path="/menu" element={<Menu updateUser={updateUser} />} />
                <Route path="/players/:slug" element={<Players />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}