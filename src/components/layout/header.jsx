import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

import HeaderNav from '../header/Nav';
import { disconnect } from '../../api/user';

export default function Header({user, updateUser, loading}) {
    const navigate = useNavigate();

    const disconnectUser = (user) => {
        disconnect(user).then(() => {
            updateUser();
            navigate('/');
        });
    };

    return (
        <header>
            <Navbar expand="lg" fixed="top" bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand onClick={() => !loading && navigate('/')}>
                        <img
                            alt="logo"
                            src="/logo192.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />
                        Wide Esport Bettings
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <HeaderNav user={user} disconnectUser={disconnectUser} loading={loading} />
                </Container>
            </Navbar>
        </header>
    )
}
