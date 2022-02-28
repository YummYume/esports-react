import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';

import { getAllAvailableGames, getHeroesItemsAvailableGames } from '../../api/pandaScore';
import UserFavouriteLeagues from '../common/UserFavouriteLeagues';
import UserBets from '../common/UserBets';

const HeaderNav = ({user, disconnectUser, loading, updateUser}) => {
    const [showFavouriteLeagues, setShowFavouriteLeagues] = useState(false);
    const [userBetsShow, setUserBetsShow] = useState(false);
    const navigate = useNavigate();

    const handleFavouriteLeaguesShow = () => setShowFavouriteLeagues(true);
    const handleFavouriteLeaguesClose = () => setShowFavouriteLeagues(false);
    const handleUserBetsShow = () => setUserBetsShow(true);
    const handleUserBetsClose = () => setUserBetsShow(false);

    if (false !== user) {
        return (
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                <Nav>
                    <NavDropdown title="Matchs" id="matchesDropdown" align="end" menuVariant="dark" disabled={loading}>
                        {getAllAvailableGames().map((game) => (
                            <NavDropdown.Item key={game.slug} onClick={() => navigate(`/matches/${game.slug}/upcoming`)}>{game.name}</NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    <NavDropdown title="Equipes" id="teamsDropdown" align="end" menuVariant="dark" disabled={loading}>
                        {getAllAvailableGames().map((game) => (
                            <NavDropdown.Item key={game.slug} onClick={() => navigate(`/teams/${game.slug}`)}>{game.name}</NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    <NavDropdown title="Joueurs" id="playersDropdown" align="end" menuVariant="dark" disabled={loading}>
                        {getAllAvailableGames().map((game) => (
                            <NavDropdown.Item key={game.slug} onClick={() => navigate(`/players/${game.slug}`)}>{game.name}</NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    <NavDropdown title="Ligues" id="leaguesDropdown" align="end" menuVariant="dark" disabled={loading}>
                        {getAllAvailableGames().map((game) => (
                            <NavDropdown.Item key={game.slug} onClick={() => navigate(`/leagues/${game.slug}`)}>{game.name}</NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    <NavDropdown title="Autres" id="othersDropdown" align="end" menuVariant="dark" disabled={loading}>
                        {getHeroesItemsAvailableGames().map((game) => (
                            <NavDropdown.Item key={game.slug} onClick={() => navigate(`/heroes/${game.slug}`)}>Les personnages de {game.name}</NavDropdown.Item>
                        ))}
                        {getHeroesItemsAvailableGames().map((game) => (
                            <NavDropdown.Item key={game.url} onClick={() => navigate(`/items/${game.slug}`)}>Les items de {game.name}</NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    <NavDropdown title={`${user.username} (${user.coins} jeton${user.coins > 1 ? 's' : ''})`} id="userDropdown" align="end" menuVariant="dark" disabled={loading}>
                        <NavDropdown.Item onClick={() => navigate('/menu')}>Accueil</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item>Ajouter des jetons</NavDropdown.Item>
                        <NavDropdown.Item onClick={handleUserBetsShow}>Mes paris</NavDropdown.Item>
                        <NavDropdown.Item onClick={handleFavouriteLeaguesShow}>Mes ligues favorites</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => disconnectUser(user)}>Déconnexion</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <UserBets user={user} show={userBetsShow} handleClose={handleUserBetsClose} updateUser={updateUser} />
                <UserFavouriteLeagues user={user} show={showFavouriteLeagues} handleClose={handleFavouriteLeaguesClose} />
            </Navbar.Collapse>
        );
    }

    return (
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav.Link className="text-info" onClick={() => navigate('/login')} disabled={loading}>Connexion</Nav.Link>
            <Navbar.Text>ou</Navbar.Text>
            <Nav.Link className="text-info" onClick={() => navigate('/register')} disabled={loading}>Inscription</Nav.Link>
        </Navbar.Collapse>
    );
};

export default HeaderNav;
