import axios from 'axios';
import sha256 from 'crypto-js/sha256';

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