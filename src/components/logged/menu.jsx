import React, { useState, useEffect } from 'react';
import { isLoggedIn } from '../API/user';
import { useNavigate } from 'react-router-dom';
import { getGameLeagues } from '../API/pandaScore';

export default function Menu({updateUser}) {
    const navigate = useNavigate();
    const [leagues, setLeagues] = useState({});

    useEffect(() => {
        isLoggedIn().then((loggedIn) => {
            if (!loggedIn) {
                updateUser();
                navigate('/menu');
            }

            getGameLeagues().then((leagues) => {
                console.log(leagues);
                setLeagues(leagues);
            });
        });
    }, []);

    return (
        <div>
            <h1>Logged in!</h1>
        </div>
    )
}
