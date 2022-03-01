import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import ReactCountryFlag from "react-country-flag";
import ReactPlayer from 'react-player/twitch';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { getBets } from '../../api/user';
import BetModal from '../common/BetModal';

import cardStyles from '../../styles/MatchCard.module.scss';

const MatchItem = ({match, endpoint, user, updateUser}) => {
    const [modalShow, setModalShow] = useState(false);
    const [bet, setBet] = useState(null);
    const [betOn, setBetOn] = useState(null);
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const firstOpponent = {...match.opponents[0].opponent, ...match.results.find(team => team.team_id === match.opponents[0].opponent.id)};
    const secondOpponent = {...match.opponents[1].opponent, ...match.results.find(team => team.team_id === match.opponents[1].opponent.id)};
    const opponents = [firstOpponent, secondOpponent];
    const now = new Date();
    const begin_at = match.begin_at ? new Date(match.begin_at) : null;
    const end_at = match.end_at ? new Date(match.end_at) : null;
    const winner = opponents.find(opponent => opponent.id === match.winner_id) ?? null;

    const handleShow = () => setModalShow(true);
    const handleClose = () => setModalShow(false);

    const updateBets = async () => {
        setLoading(true);

        getBets(null, match).then((data) => {
            setBets(data);
            setBet(data.find(bet => bet.user_id === user.id) ?? null);
        }).catch((error) => {
            console.error(`Error during useEffect (MatchItem) : ${error}`);
        }).finally(() => {
            setLoading(false);
        });
    };

    const onUpdate = async () => {
        updateBets();
        updateUser();
    };

    useEffect(() => {
        updateBets();
    }, []);

    useEffect(() => {
        bet && (setBetOn(match.opponents.find(team => team.opponent.id === bet.betOn)));
    }, [bet]);

    return (
        <Col className="my-3" xl={6} xs={12}>
            <Card
                text="light"
                bg="dark"
                border={
                    !bet ? 'light'
                    : !bet.processed ? 'warning'
                    : 'won' === bet.status ? 'success'
                    : 'lost' === bet.status ? 'danger'
                    : 'draw' === bet.status || 'canceled' === bet.status ? 'muted'
                    : 'light'
                }
                className={cardStyles.cardMinHeight}
            >
                <Card.Body>
                    <Row className="h-100 align-items-center justify-content-center">
                        <Col className="mb-2" xs={12}>
                            <Card.Title className="mt-2 text-center">
                                {match.name}
                            </Card.Title>
                            <Card.Text as="div" className="mt-2 text-center">
                                <p className="m-0">Nombre de paris : <strong>{bets.length}</strong></p>
                                <p className="m-0">Nombre de parties : <strong>{match.number_of_games}</strong></p>
                                {match.begin_at && (
                                    <p className="m-0">Date de début : <strong>{
                                        `le ${begin_at.getDate()}/${begin_at.getMonth()+1}/${begin_at.getFullYear()} à ${begin_at.getHours() < 10 ? '0' + begin_at.getHours() : begin_at.getHours()}h${begin_at.getMinutes() < 10 ? '0' + begin_at.getMinutes() : begin_at.getMinutes()}`
                                    }</strong></p>
                                )}
                                {match.end_at && (
                                    <p className="m-0">Date de fin : <strong>{
                                        `le ${end_at.getDate()}/${end_at.getMonth()+1}/${end_at.getFullYear()} à ${end_at.getHours() < 10 ? '0' + end_at.getHours() : end_at.getHours()}h${end_at.getMinutes() < 10 ? '0' + end_at.getMinutes() : end_at.getMinutes()}`
                                    }</strong></p>
                                )}
                                <p className="m-0">Status : <strong>{
                                    'not_started' === match.status ? 'À venir' : 'running' === match.status ? 'En cours' : 'finished' === match.status ? 'Terminé' : 'Inconnu'
                                }</strong></p>
                                {match.league && (
                                    <p className="m-0">Ligue : <strong><Link to={`/leagues/matches/${match.league.id}/${endpoint}`}>{match.league.name}</Link></strong></p>
                                )}
                                {match.videogame && (
                                    <p className="m-0">Jeu vidéo : <strong>{match.videogame.name}</strong></p>
                                )}
                                {'running' === endpoint && (
                                    <React.Fragment>
                                        {match.game_advantage && (
                                            <p className="m-0">Avantage : <strong>{opponents.find(opponent => opponent.id === match.game_advantage).name}</strong></p>
                                        )}
                                        {match.official_stream_url && (
                                            <div className="my-2 w-100">
                                                <ReactPlayer url={match.official_stream_url} width="100%" height="400px" />
                                            </div>
                                        )}
                                    </React.Fragment>
                                )}
                                {'past' === endpoint && (
                                    <React.Fragment>
                                        {winner && (
                                            <p className="m-0">Vainqueur : <strong>{winner.name}</strong></p>
                                        )}
                                        {match.draw && (
                                            <p className="m-0">Résultat : <strong>Égalité</strong></p>
                                        )}
                                    </React.Fragment>
                                )}
                            </Card.Text>
                        </Col>
                        <Col className="mb-2" sm={6} xs={12}>
                            <Row>
                                <Col sm={5} xs={6} className="d-flex justify-content-center align-items-center">
                                    <Image
                                        rounded={true}
                                        src={firstOpponent.image_url ?? 'https://c.tenor.com/_9Fx5W2D0ZkAAAAC/tiens-tiens-tiens-tiens.gif'}
                                        className={cardStyles.imgHeight}
                                    />
                                </Col>
                                <Col className="text-start" sm={7} xs={6}>
                                    <Card.Title className={
                                        `mt-2${winner && (winner.id === firstOpponent.id) ? ' text-success' : ''}${winner && (winner.id !== firstOpponent.id) ? ' text-danger' : ''}`
                                    }>
                                        {firstOpponent.name}
                                    </Card.Title>
                                    <Card.Text as="div">
                                        <p className="m-0">Score : <strong>{firstOpponent.score ?? '0'}</strong></p>
                                        {firstOpponent.location && (
                                            <p className="m-0">Pays : <ReactCountryFlag countryCode={firstOpponent.location} svg /> <strong>{firstOpponent.location}</strong></p>
                                        )}
                                    </Card.Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="mb-2" sm={6} xs={12}>
                            <Row>
                                <Col className="text-end" sm={7} xs={6}>
                                    <Card.Title className={
                                        `mt-2${winner && (winner.id === secondOpponent.id) ? ' text-success' : ''}${winner && (winner.id !== secondOpponent.id) ? ' text-danger' : ''}`
                                    }>
                                        {secondOpponent.name}
                                    </Card.Title>
                                    <Card.Text as="div">
                                        <p className="m-0">Score : <strong>{secondOpponent.score ?? '0'}</strong></p>
                                        {secondOpponent.location && (
                                            <p className="m-0">Pays : <ReactCountryFlag countryCode={secondOpponent.location} svg /> <strong>{secondOpponent.location}</strong></p>
                                        )}
                                    </Card.Text>
                                </Col>
                                <Col sm={5} xs={6} className="d-flex justify-content-center align-items-center">
                                    <Image
                                        rounded={true}
                                        src={secondOpponent.image_url ?? 'https://c.tenor.com/_9Fx5W2D0ZkAAAAC/tiens-tiens-tiens-tiens.gif'}
                                        className={cardStyles.imgHeight}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            {(bet && betOn) && (
                                <div className="text-center">
                                    <h3 className="my-1">Vous avez parié pour <strong>{`${betOn.opponent.name} (${bet.amount} jetons)`}</strong></h3>
                                </div>
                            )}
                            {(bet && 'past' === endpoint && 'won' === bet.status) && (
                                <div className="text-center">
                                    <h3 className="my-1 text-success">Pari gagné (+{bet.amount * 2} jetons)</h3>
                                </div>
                            )}
                            {(bet && 'past' === endpoint && 'lost' === bet.status) && (
                                <div className="text-center">
                                    <h3 className="my-1 text-danger">Pari perdu (-{bet.amount} jetons)</h3>
                                </div>
                            )}
                            {(bet && 'past' === endpoint && 'draw' === bet.status) && (
                                <div className="text-center">
                                    <h3 className="my-1 text-muted">Match nul ({bet.amount} jetons remboursés)</h3>
                                </div>
                            )}
                            {(bet && 'past' === endpoint && 'canceled' === bet.status) && (
                                <div className="text-center">
                                    <h3 className="my-1 text-muted">Match annulé ({bet.amount} jetons remboursés)</h3>
                                </div>
                            )}
                        </Col>
                        <Col sm={6} xs={12}>
                            {('upcoming' === endpoint && now < begin_at) && (
                                <React.Fragment>
                                    <Button className="my-2 w-100" variant={bet ? 'outline-warning' : 'outline-light'} onClick={handleShow} disabled={loading}>
                                        {bet ? 'Modifier le pari' : 'Parier'}
                                    </Button>
                                    <BetModal user={user} match={match} matchBet={bet} show={modalShow} handleClose={handleClose} onBet={onUpdate} />
                                </React.Fragment>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default MatchItem;
