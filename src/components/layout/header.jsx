import React from 'react';
import { isLoggedIn } from '../API/user';
import { useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

export default function Header() {
    const navigate = useNavigate();

    return (
        <header>
            <Navbar fixed="top" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand onClick={() => navigate('/')}>
                        <img
                            alt=""
                            src="/logo192.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />
                        Esport Bettings
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </header>
    )
}
