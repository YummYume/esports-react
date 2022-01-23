import axios from 'axios';
import sha256 from 'crypto-js/sha256';

export const getUserOrFalse = async (username, password) => {
    let params = {
        username: username,
        password: sha256(password).toString()
    };

    const res = await axios.get(`${process.env.REACT_APP_DB_URL}/users`, {
        params : params
    });

    if (res.data.length > 0) {
        return res.data[0];
    }

    return false;
};

export const getUserWithToken = async (token, username = null, id = null) => {
    if (null === token) {
        return false;
    }

    let params = {
        token: token
    };

    if (username) {
        params = {
            ...params,
            username: username
        }
    }

    if (id) {
        params = {
            ...params,
            id: id
        }
    }

    const res = await axios.get(`${process.env.REACT_APP_DB_URL}/users`, {
        params : params
    });

    if (res.data.length > 0) {
        return res.data[0];
    }

    return false;
};

export const isLoggedIn = () => {
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        return false;
    }

    if (null === user || typeof user !== 'object' || !user.hasOwnProperty('token') || !user.hasOwnProperty('username') || !user.hasOwnProperty('id')) {
        return false;
    }

    return getUserWithToken(user.token, user.username, user.id) !== false;
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

export const disconnect = (user) => {
    try {
        const userWithoutToken = {
            ...user,
            token: null
        };

        axios.put(`${process.env.REACT_APP_DB_URL}/users/${userWithoutToken.id}`, userWithoutToken, {
            headers: {
                header: 'Content-Type: application/json'
            }
        });

        localStorage.removeItem('user');
        return true;
    } catch (error) {
        return false;
    }
};
