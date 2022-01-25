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
            if (response.status === 200) {
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
