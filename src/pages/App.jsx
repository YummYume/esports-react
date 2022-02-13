import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";
import ScrollToTop from "react-scroll-to-top";
import { useIdleTimer } from 'react-idle-timer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { getUserWithToken, disconnect } from '../api/user';
import styles from '../styles/App.module.scss';
import Header from '../components/layout/Header';
import Main from './Main';
import Login from './Login';
import Menu from './Menu';
import Players from './Players';
import NotFound from './NotFound';
import Leagues from './Leagues';
import Register from './Register';
import { useNavigate } from 'react-router-dom';

export default function App() {
    const handleOnIdle = async (event) => {
        swal.fire({
            icon: 'question',
            title: <p className="text-dark">Êtes-vous vivants?</p>,
            text: 'Ceci est une vraie question.',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
            reverseButtons: true,
            showCancelButton: true,
            customClass: {
                confirmButton: 'btn btn-success mx-2',
                cancelButton: 'btn btn-danger mx-2',
            },
            buttonsStyling: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            swal.fire({
                icon: result.isConfirmed ? 'success' : 'error',
                text: result.isConfirmed ? ':)' : ':(',
            });

            result.isDismissed && user && (
                disconnect(user).then(() => {
                    updateUser();
                }).catch((error) => {
                    console.error(`Error during handleOnIdle (App) : ${error}`);
                })
            );
        });
    };

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(false);
    const swal = withReactContent(Swal);
    const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: 120000,
        onIdle: handleOnIdle,
    });

    const updateUser = () => {
        setLoading(true);
        const lastUser = user;

        getUserWithToken(JSON.parse(localStorage.getItem('userToken'))).then((userData) => {
            setUser(userData);
            !userData && lastUser && (navigate('/'));
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
                <Route path="/register" element={<Register updateUser={updateUser} />} />
                <Route path="/menu" element={<Menu updateUser={updateUser} />} />
                <Route path="/players/:slug" element={<Players />} />
                <Route path="/leagues/:slug" element={<Leagues />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <ScrollToTop smooth />
        </div>
    );
}
