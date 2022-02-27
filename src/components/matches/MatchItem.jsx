import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import ReactCountryFlag from "react-country-flag";
import ReactPlayer from 'react-player/twitch';
import Button from 'react-bootstrap/Button';

import cardStyles from '../../styles/MatchCard.module.scss';
import { getBets } from '../../api/user';
import BetModal from '../common/BetModal';

const MatchItem = ({match, endpoint, user, updateUser}) => {
    const [modalShow, setModalShow] = useState(false);
    const [bet, setBet] = useState(null);
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleShow = () => setModalShow(true);
    const handleClose = () => setModalShow(false);

    let firstOpponent = match.opponents[0].opponent;
    let secondOpponent = match.opponents[1].opponent;
    firstOpponent = {...firstOpponent, ...match.results.find(team => team.team_id === firstOpponent.id)};
    secondOpponent = {...secondOpponent, ...match.results.find(team => team.team_id === secondOpponent.id)};

    const opponents = [firstOpponent, secondOpponent];
    const begin_at = match.begin_at ? new Date(match.begin_at) : null;
    const end_at = match.end_at ? new Date(match.end_at) : null;
    const winner = opponents.find(opponent => opponent.id === match.winner_id) ?? null;

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

    return (
        <Col className="my-3" xl={6} xs={12}>
            <Card
                text="light"
                bg="dark"
                border={
                    !bet ? 'light'
                    : !bet.processed ? 'warning'
                    : 'won' === bet.status ? 'success'
                    : 'danger'
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
                                        `${begin_at.getDate()}/${begin_at.getMonth()+1}/${begin_at.getFullYear()}`
                                    }</strong></p>
                                )}
                                {match.end_at && (
                                    <p className="m-0">Date de fin : <strong>{
                                        `${end_at.getDate()}/${end_at.getMonth()+1}/${end_at.getFullYear()}`
                                    }</strong></p>
                                )}
                                <p className="m-0">Status : <strong>{
                                    'not_started' === match.status ? 'À venir' : 'running' === match.status ? 'En cours' : 'finished' === match.status ? 'Terminé' : 'Inconnu'
                                }</strong></p>
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
                                <Col sm={7} xs={6}>
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
                        <Col sm={6} xs={12}>
                            {'upcoming' === endpoint && (
                                <React.Fragment>
                                    <Button className="my-1 w-100" variant={bet ? 'outline-warning' : 'outline-light'} onClick={handleShow} disabled={loading}>
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
