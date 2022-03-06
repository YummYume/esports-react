import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";
import ScrollToTop from "react-scroll-to-top";
import { useIdleTimer } from 'react-idle-timer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

import { getUserWithToken, disconnect, findGifts, claimGift, processBets, addCoins } from '../api/user';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Main from './Main';
import Login from './Login';
import Menu from './Menu';
import Players from './Players';
import NotFound from './NotFound';
import Leagues from './Leagues';
import LeagueMatches from './LeagueMatches';
import Register from './Register';
import Matches from './Matches';
import Teams from './Teams';
import Heroes from './Heroes';
import Items from './Items';

import styles from '../styles/App.module.scss';

export default function App() {
    const handleOnIdle = async (event) => {
        if (!swal.isVisible()) {
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
        }
    };
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(false);
    const swal = withReactContent(Swal);
    const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: 120000,
        onIdle: handleOnIdle,
    });

    const updateUser = async (showLoading = true) => {
        showLoading && (setLoading(true));
        const lastUser = user;
        let newUser = null;

        await getUserWithToken(JSON.parse(localStorage.getItem('userToken'))).then((userData) => {
            newUser = userData;
            setUser(userData);
            !userData && lastUser && (navigate('/'));
        }).catch((error) => {
            console.error(`Error during updateUser (App) : ${error}`);
        }).finally(() => {
            setLoading(false);
        });

        if (newUser) {
            if (newUser.coins > process.env.REACT_APP_MAX_COINS) {
                addCoins(newUser, 0).then(res => {
                    swal.fire({
                        icon: 'info',
                        title: 'Remise à niveau de vos jetons',
                        text: `Vos jetons dépassaient le nombre maximal autorisé (${process.env.REACT_APP_MAX_COINS}), ils ont donc été remis à niveau.`,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            title: 'text-dark',
                        },
                    });
                }).then(() => {
                    updateUser();
                });
            }

            findGifts(newUser).then((userGifts) => {
                if (userGifts.length) {
                    let currentGift = userGifts[0];

                    swal.fire({
                        icon: 'info',
                        title: 'Un cadeau!',
                        text: currentGift.reason,
                        timer: currentGift.timer,
                        timerProgressBar: currentGift.timer > 0,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonText: 'Récupérer',
                        customClass: {
                            title: 'text-dark',
                        },
                        preConfirm: () => {
                            return claimGift(currentGift, newUser);
                        },
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Cadeau récupéré',
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                confirmButtonText: 'Merci!',
                                customClass: {
                                    title: 'text-dark',
                                },
                            }).then(() => {
                                updateUser();
                            });
                        }
                    });
                }
            }).catch((error) => {
                console.error(`Error during updateUser (App) : ${error}`);
            });

            processBets(newUser).then((results) => {
                if (results.length) {
                    const totalCoins = results.reduce((partialSum, current) => {
                        if ('lost' === current.status) {
                            return partialSum - current.amount;
                        } else if ('won' === current.status) {
                            return partialSum + (current.amount * 2);
                        } else {
                            return partialSum;
                        }
                    }, 0);
                    const html = <div>
                        {results.map((betResult, index) => (
                            <p className="mt-0" key={index}><span className="text-dark">{betResult.name}</span> : <span className={`text-${'won' === betResult.status ? 'success' : 'lost' === betResult.status ? 'danger' : 'muted'}`}>{
                                'won' === betResult.status ? `Gagné (+${betResult.amount * 2})`
                                : 'lost' === betResult.status ? `Perdu (-${betResult.amount})`
                                : 'draw' === betResult.status ? `Match nul (${betResult.amount} jeton${betResult.amount > 1 ? 's' : ''} remboursé${betResult.amount > 1 ? 's' : ''})`
                                : 'canceled' === betResult.status ? `Match annulé (${betResult.amount} jeton${betResult.amount > 1 ? 's' : ''} remboursé${betResult.amount > 1 ? 's' : ''})`
                                : 'Status inconnu'
                            }</span></p>
                        ))}
                        <h4 className="mt-0 mb-1">
                            <span className="text-dark">Total :</span>
                            <span className={`text-${totalCoins < 0 ? 'danger' : 'success'}`}>
                                {totalCoins > 0 ? '+' : ''}{totalCoins} jeton{totalCoins > 1 || totalCoins < -1 ? 's' : ''}
                            </span>
                        </h4>
                    </div>;

                    swal.fire({
                        icon: 'info',
                        title: 'Résumé de vos derniers paris',
                        html: html,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonText: 'Ok',
                        customClass: {
                            title: 'text-dark',
                        },
                    }).then(() => {
                        updateUser();
                    });
                }
            }).catch((error) => {
                console.error(`Error during updateUser (App) : ${error}`);
            });
        }
    };

    useEffect(() => {
        updateUser();
        const userRefreshInterval = setInterval(() => {
            updateUser(false);
        }, 60000);

        return () => clearInterval(userRefreshInterval);
    }, []);

    return (
        <React.Fragment>
            <Header user={user} updateUser={updateUser} loading={loading} />
            <div id="app">
                <PacmanLoader color="cyan" loading={loading} css="position:absolute;left:45%;transform:translate(-55%, 0);z-index:100;" size={75} />
                {loading && <div className={styles.loading} />}
                <Routes>
                    <Route path="/" element={<Main user={user} />} />
                    <Route path="/login" element={<Login updateUser={updateUser} />} />
                    <Route path="/register" element={<Register updateUser={updateUser} />} />
                    <Route path="/menu" element={<Menu user={user} updateUser={updateUser} />} />
                    <Route path="/players/:slug" element={<Players />} />
                    <Route path="/leagues/:slug" element={<Leagues user={user} />} />
                    <Route path="/teams/:slug" element={<Teams />} />
                    <Route path="/matches/:slug/:endpoint" element={<Matches user={user} updateUser={updateUser} />} />
                    <Route path="/leagues/matches/:league/:endpoint" element={<LeagueMatches user={user} updateUser={updateUser} />} />
                    <Route path="/heroes/:slug" element={<Heroes />} />
                    <Route path="/items/:slug" element={<Items />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <ScrollToTop smooth />
            </div>
            <Footer />
        </React.Fragment>
    );
}
