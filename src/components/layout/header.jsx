import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { disconnect } from '../../api/user';
import HeaderNav from '../header/Nav';

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
            <Navbar collapseOnSelect expand="lg" fixed="top" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand onClick={() => !loading && navigate('/')}>
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
                        <HeaderNav user={user} disconnectUser={disconnectUser} loading={loading} />
                    </Nav>
                </Container>
            </Navbar>
        </header>
    )
}
