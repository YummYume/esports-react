import axios from 'axios';

export const getUserOrFalse = async (username, password) => {
    const res = await axios.get('http://localhost:3004/users', {
        params : {
            username: username,
            password: password
        }
    });

    if (res.data.length > 0) {
        return res.data[0];
    }

    return false;
};
