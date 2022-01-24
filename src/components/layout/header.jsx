import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import useLocalStorage from '@dothq/react-use-localstorage';
import { isLoggedIn, disconnect } from '../API/user';

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useLocalStorage('user');

    const disconnect = () => {

    };

    const HeaderNav = () => {
        const currentUser = typeof user === 'string' ? JSON.parse(user) : user;

        if (isLoggedIn()) {
            return (
                <Navbar.Collapse className="justify-content-end">
                    <NavDropdown title={currentUser.username} id="userDropdown">
                        <NavDropdown.Item onClick={() => navigate('/menu')}>Accueil</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => disconnect(currentUser)}>Déconnexion</NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            );
        }

        return (
            <Navbar.Collapse className="justify-content-end">
                <Nav.Link className="text-info" onClick={() => navigate('/login')}>Connexion</Nav.Link>
                <Navbar.Text>ou</Navbar.Text>
                <Nav.Link className="text-info" onClick={() => navigate('/login')}>Inscription</Nav.Link>
            </Navbar.Collapse>
        );
    };

    return (
        <header>
            <Navbar collapseOnSelect expand="lg" fixed="top" bg="dark" variant="dark">
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
                    <Nav>
                        <HeaderNav />
                    </Nav>
                </Container>
            </Navbar>
        </header>
    )
}
