import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import { getMatch } from './pandaScore';

export const getUserOrFalse = async (username, password = null) => {
    let params = {
        username: username
    };

    password && (params = { ...params, password: sha256(password).toString() });

    const res = await axios.get(`${process.env.REACT_APP_DB_URL}/users`, {
        params : params
    });

    if (res.data.length > 0) {
        return res.data[0];
    }

    return false;
};

export const getUserWithToken = async (token, username = null, id = null) => {
    if (undefined === token || null === token) {
        return false;
    }

    let params = {
        token: token
    };

    username && (params = { ...params, username: username });
    id && (params = { ...params, id: id });

    const res = await axios.get(`${process.env.REACT_APP_DB_URL}/users`, {
        params : params
    });

    if (res.data.length > 0) {
        return res.data[0];
    }

    return false;
};

export const isLoggedIn = async () => {
    const user = await getUserWithToken(JSON.parse(localStorage.getItem('userToken')));

    if (false === user || !user.hasOwnProperty('token') || !user.hasOwnProperty('username') || !user.hasOwnProperty('id')) {
        return false;
    }

    return true;
};

export const generateToken = (user) => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const now = new Date();

    const userWithToken = {
        ...user,
        token: token,
        lastLogin: now.toJSON()
    };

    axios.put(`${process.env.REACT_APP_DB_URL}/users/${userWithToken.id}`, userWithToken, {
        headers: {
            header: 'Content-Type: application/json'
        }
    });

    return {
        id: userWithToken.id,
        username: userWithToken.username,
        token: userWithToken.token
    };
};

export const disconnect = async (user) => {
    try {
        const userWithoutToken = {
            ...user,
            token: null
        };

        await axios.put(`${process.env.REACT_APP_DB_URL}/users/${userWithoutToken.id}`, userWithoutToken, {
            headers: {
                header: 'Content-Type: application/json'
            }
        }).then((response) => {
            if (200 === response.status) {
                localStorage.removeItem('userToken');
                return true;
            }

            return false;
        }).catch((error) => {
            console.error(`Error during disconnect : ${error.message}`);
            return false;
        });
    } catch (error) {
        console.error(`Error during disconnect : ${error.message}`);
        return false;
    }
};

export const register = async (user) => {
    let registered = false;

    try {
        const newUser = {
            ...user,
            password: sha256(user.password).toString(),
            coins: 100,
            token: null,
            lastLogin: null
        };

        await axios.post(`${process.env.REACT_APP_DB_URL}/users`, newUser, {
            headers: {
                header: 'Content-Type: application/json'
            }
        }).then((response) => {
            registered = response.status === 201;
            addGift(response.data, 100, 'Vous avez obtenu 100 jetons supplémentaires pour votre première connexion. Attrapez les vite!', 20000);
        }).catch((error) => {
            console.error(`Error during register : ${error.message}`);
        });
    } catch (error) {
        console.error(`Error during register : ${error.message}`);
    }

    return registered;
};

export const getFavouriteLeagues = async (user) => {
    const params = {
        user_id: user.id,
        _sort: 'id',
        _order: 'desc',
    };

    const res = await axios.get(`${process.env.REACT_APP_DB_URL}/favourites`, {
        params : params
    });

    return res.data ?? [];
};

export const getFavouriteLeague = async (user, league) => {
    const params = {
        user_id: user.id,
        league_id: league.id,
    };

    const res = await axios.get(`${process.env.REACT_APP_DB_URL}/favourites`, {
        params : params,
    });

    return res.data.length ? res.data[0] : null;
};

export const addFavouriteLeague = async (user, league) => {
    const isFavourite = await getFavouriteLeague(user, league);

    if (isFavourite) {
        return false;
    }

    let favourite = null;

    try {
        const newFavourite = {
            user_id: user.id,
            league_id: league.id,
            league_name: league.name,
            league_picture: league.image_url,
        };

        await axios.post(`${process.env.REACT_APP_DB_URL}/favourites`, newFavourite, {
            headers: {
                header: 'Content-Type: application/json'
            }
        }).then((response) => {
            favourite = response.data;
        }).catch((error) => {
            console.error(`Error during addFavouriteLeague : ${error.message}`);
        });
    } catch (error) {
        console.error(`Error during addFavouriteLeague : ${error.message}`);
    }

    return favourite;
};

export const removeFavouriteLeague = async (favourite) => {
    const response = await axios.delete(`${process.env.REACT_APP_DB_URL}/favourites/${favourite.id}`, {
        headers: {
            header: 'Content-Type: application/json'
        },
    });

    return 200 === response.status ? null : favourite;
};

export const findGifts = async (user) => {
    const params = {
        user: user.id,
        claimed: false,
    };

    const res = await axios.get(`${process.env.REACT_APP_DB_URL}/gifts`, {
        params : params
    });

    return res.data ?? [];
};

export const addGift = async (user, amount, reason = '', timer = 0) => {
    let added = false;

    try {
        const gift = {
            user: user.id,
            amount: amount,
            claimed: false,
            claimedAt: null,
            reason: reason,
            timer: timer,
        };

        await axios.post(`${process.env.REACT_APP_DB_URL}/gifts`, gift, {
            headers: {
                header: 'Content-Type: application/json'
            }
        }).then((response) => {
            added = response.status === 201;
        }).catch((error) => {
            console.error(`Error during addGift : ${error.message}`);
        });
    } catch (error) {
        console.error(`Error during addGift : ${error.message}`);
    }

    return added;
};

export const claimGift = async (gift, user) => {
    const claimedGift = {
        ...gift,
        claimed: true,
        claimedAt: new Date(),
    };
    let claimed = false;

    await axios.put(`${process.env.REACT_APP_DB_URL}/gifts/${gift.id}`, claimedGift, {
        headers: {
            header: 'Content-Type: application/json'
        }
    }).then((res) => {
        claimed = 200 === res.status;
    }).catch((error) => {
        console.error(`Error during claimGift : ${error.message}`);
    });

    const res = await addCoins(user, gift.amount);

    return claimed && res;
}

export const addCoins = async (user, amount, remove = false) => {
    const newAmount = Math.max(process.env.REACT_APP_MIN_COINS, Math.min(amount, process.env.REACT_APP_MAX_COINS));
    const userWithNewCoins = {
        ...user,
        coins: remove ? user.coins - newAmount : user.coins + newAmount,
    };
    let added = false;

    await axios.put(`${process.env.REACT_APP_DB_URL}/users/${user.id}`, userWithNewCoins, {
        headers: {
            header: 'Content-Type: application/json'
        }
    }).then((res) => {
        added = 200 === res.status;
    }).catch((error) => {
        console.error(`Error during claimGift : ${error.message}`);
    });

    return added ? userWithNewCoins : false;
};

export const getBets = async (user = null, match = null) => {
    let params = {
        _sort: 'id',
        _order: 'desc',
    };
    user && (params = {...params, user_id: user.id});
    match && (params = {...params, match_id: match.id});

    const res = await axios.get(`${process.env.REACT_APP_DB_URL}/bets`, {
        params : params,
    });

    return res.data;
};

export const getBet = async (user, match) => {
    const params = {
        user_id: user.id,
        match_id: match.id,
    };

    const res = await axios.get(`${process.env.REACT_APP_DB_URL}/bets`, {
        params : params,
    });

    return res.data.length ? res.data[0] : null;
};

export const addBet = async (user, match, amount, betOn) => {
    const betExists = await getBet(user, match);

    if (betExists || 'not_started' !== match.status) {
        return false;
    }

    let bet = null;

    try {
        const newBet = {
            user_id: user.id,
            match_id: match.id,
            processed: false,
            name: match.name,
            startAt: match.beginAt,
            opponents: match.opponents,
            amount: amount,
            betOn: betOn,
            status: null,
            startAt: match.begin_at,
            endAt: match.end_at,
            videogame: match.videogame,
        };

        await axios.post(`${process.env.REACT_APP_DB_URL}/bets`, newBet, {
            headers: {
                header: 'Content-Type: application/json'
            }
        }).then((response) => {
            bet = response.data;
        }).catch((error) => {
            console.error(`Error during addBet : ${error.message}`);
        });
    } catch (error) {
        console.error(`Error during addBet : ${error.message}`);
    }

    bet && (await addCoins(user, amount, true));

    return bet;
};

export const editBet = async (bet, user, amount, betOn) => {
    let res = null;

    if (0 === amount) {
        return false;
    }

    try {
        const newBet = {
            ...bet,
            amount: amount,
            betOn: betOn,
        };

        await axios.put(`${process.env.REACT_APP_DB_URL}/bets/${bet.id}`, newBet, {
            headers: {
                header: 'Content-Type: application/json'
            }
        }).then((response) => {
            res = response.data;
        }).catch((error) => {
            console.error(`Error during editBet : ${error.message}`);
        });
    } catch (error) {
        console.error(`Error during editBet : ${error.message}`);
    }

    if (bet.amount < res.amount) {
        res && (await addCoins(user, amount - bet.amount, true));
    } else if (bet.amount > bet.amount) {
        res && (await addCoins(user, bet.amount - amount));
    }

    return res;
};

export const removeBet = async (bet, user) => {
    const response = await axios.delete(`${process.env.REACT_APP_DB_URL}/bets/${bet.id}`, {
        headers: {
            header: 'Content-Type: application/json'
        },
    });

    200 === response.status && (await addCoins(user, bet.amount));

    return 200 === response.status ? null : bet;
};

export const processBets = async (user) => {
    const bets = await getBets(user);
    const now = new Date();
    let results = [];

    await Promise.all(bets.map(async (bet) => {
        const matchDate = new Date(bet.startAt);

        if (!bet.processed && matchDate < now) {
            const betMatch = await getMatch(bet.match_id);
            const match = betMatch.data;
            let processedBet = null;
            let res = null;

            if ('finished' === match.status) {
                if (match.winner_id === bet.betOn) {
                    await addCoins(user, bet.amount * 2);
                    processedBet = {
                        ...bet,
                        opponents: match.opponents,
                        results: match.results,
                        startAt: match.begin_at,
                        endAt: match.end_at,
                        processed: true,
                        status: 'won',
                    };
                } else if (!match.draw && match.winner_id) {
                    await addCoins(user, bet.amount, true);
                    processedBet = {
                        ...bet,
                        opponents: match.opponents,
                        results: match.results,
                        startAt: match.begin_at,
                        endAt: match.end_at,
                        processed: true,
                        status: 'lost',
                    };
                } else if (match.draw) {
                    await addCoins(user, bet.amount);
                    processedBet = {
                        ...bet,
                        opponents: match.opponents,
                        results: match.results,
                        startAt: match.begin_at,
                        endAt: match.end_at,
                        processed: true,
                        status: 'draw',
                    };
                }
            } else if ('canceled' === match.status) {
                await addCoins(user, bet.amount);
                processedBet = {
                    ...bet,
                    opponents: match.opponents,
                    results: match.results,
                    startAt: match.begin_at,
                    endAt: match.end_at,
                    processed: true,
                    status: 'canceled',
                };
            }

            if (processedBet) {
                await axios.put(`${process.env.REACT_APP_DB_URL}/bets/${bet.id}`, processedBet, {
                    headers: {
                        header: 'Content-Type: application/json'
                    }
                }).then((response) => {
                    res = response.data;
                }).catch((error) => {
                    console.error(`Error during editBet : ${error.message}`);
                });
            }

            if (res) {
                results.push({
                    name: bet.name,
                    amount: bet.amount,
                    status: processedBet.status,
                });
            }
        }
    }));

    return results;
};

export const getFullLeagueFavouriteItem = async (user, league_id) => {
    const params = {
        user_id: user.id,
        league_id: league_id,
    };

    const res = await axios.get(`${process.env.REACT_APP_DB_URL}/favourites`, {
        params : params,
    });

    return res.data.length ? res.data[0] : null;
};
