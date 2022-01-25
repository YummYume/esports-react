import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { disconnect } from '../API/user';
import { getAllAvailableGames } from '../API/pandaScore';

export default function Header({user, updateUser}) {
    const navigate = useNavigate();

    const disconnectUser = (user) => {
        disconnect(user).then(() => {
            updateUser();
            navigate('/');
        });
    };

    const HeaderNav = () => {
        if (false !== user) {
            return (
                <Navbar.Collapse className="justify-content-end">
                    <NavDropdown title="Les Leagues" id="leaguesDropdown">
                        {getAllAvailableGames().map((game) => (
                            <NavDropdown.Item key={game.slug}>{game.name}</NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    <NavDropdown title={user.username} id="userDropdown">
                        <NavDropdown.Item onClick={() => navigate('/menu')}>Accueil</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => disconnectUser(user)}>Déconnexion</NavDropdown.Item>
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
                            alt="logo"
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
