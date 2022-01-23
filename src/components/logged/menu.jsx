import React, { useState, useEffect } from 'react';
import { isLoggedIn } from '../API/user';
import { useNavigate } from 'react-router-dom';

export default function Menu() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/');
        };
    });

    return (
        <div>
            <h1>Logged in!</h1>
        </div>
    )
}
