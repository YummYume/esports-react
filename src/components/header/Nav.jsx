import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';

import { getAllAvailableGames } from '../../api/pandaScore';

const HeaderNav = ({user, disconnectUser, loading}) => {
    const navigate = useNavigate();

    if (false !== user) {
        return (
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                <Nav>
                    <NavDropdown title="Matchs" id="matchesDropdown" align="end" menuVariant="dark" disabled={loading}>
                        {getAllAvailableGames().map((game) => (
                            <NavDropdown.Item key={game.slug}>{game.name}</NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    <NavDropdown title="Equipes" id="teamsDropdown" align="end" menuVariant="dark" disabled={loading}>
                        {getAllAvailableGames().map((game) => (
                            <NavDropdown.Item key={game.slug}>{game.name}</NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    <NavDropdown title="Joueurs" id="playersDropdown" align="end" menuVariant="dark" disabled={loading}>
                        {getAllAvailableGames().map((game) => (
                            <NavDropdown.Item key={game.slug} onClick={() => navigate(`/players/${game.slug}`)}>{game.name}</NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    <NavDropdown title="Leagues" id="leaguesDropdown" align="end" menuVariant="dark" disabled={loading}>
                        {getAllAvailableGames().map((game) => (
                            <NavDropdown.Item key={game.slug} onClick={() => navigate(`/leagues/${game.slug}`)}>{game.name}</NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    <NavDropdown title="Autres" id="othersDropdown" align="end" menuVariant="dark" disabled={loading}>
                        <NavDropdown.Item>Les personnages de Dota 2</NavDropdown.Item>
                        <NavDropdown.Item>Les personnages de League of Legends</NavDropdown.Item>
                        <NavDropdown.Item>Les items de Dota 2</NavDropdown.Item>
                        <NavDropdown.Item>Les items de League of Legends</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title={`${user.username} (${user.coins} jeton${user.coins > 1 ? 's' : ''})`} id="userDropdown" align="end" menuVariant="dark" disabled={loading}>
                        <NavDropdown.Item onClick={() => navigate('/menu')}>Accueil</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item>Mon compte</NavDropdown.Item>
                        <NavDropdown.Item>Mes paris</NavDropdown.Item>
                        <NavDropdown.Item>Mes favoris</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => disconnectUser(user)}>Déconnexion</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        );
    }

    return (
        <Navbar.Collapse className="justify-content-end">
            <Nav.Link className="text-info" onClick={() => navigate('/login')} disabled={loading}>Connexion</Nav.Link>
            <Navbar.Text>ou</Navbar.Text>
            <Nav.Link className="text-info" onClick={() => navigate('/register')} disabled={loading}>Inscription</Nav.Link>
        </Navbar.Collapse>
    );
};

export default HeaderNav;
