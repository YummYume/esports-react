import React, { useState } from 'react';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import ReactCountryFlag from 'react-country-flag';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import BetModal from './BetModal';

import styles from '../../styles/UserBetItem.module.scss';

export default function UserBetItem({user, match, bet, onBet}) {
    const [show, setShow] = useState(false);

    let firstOpponent = {...bet.opponents[0].opponent};
    bet.results && (firstOpponent = {...firstOpponent, ...bet.results.find(team => team.team_id === firstOpponent.id)});
    let secondOpponent = {...bet.opponents[1].opponent};
    bet.results && (secondOpponent = {...secondOpponent, ...bet.results.find(team => team.team_id === secondOpponent.id)});
    const opponents = [firstOpponent, secondOpponent];
    const betOn = match.opponents.find(team => team.opponent.id === bet.betOn);
    const now = new Date();
    const startAt = new Date(bet.startAt);
    const endAt = new Date(bet.endAt);
    const winner = 'won' === bet.status ? opponents.find(opponent => opponent.id === bet.betOn) : 'lost' === bet.status ? opponents.find(opponent => opponent.id !== bet.betOn) : null;

    return (
        <Row className="mb-4">
            <Col className="mb-1" xd={12}>
                <h3>{bet.name}</h3>
                {bet.startAt && (
                    <p className="m-0">Date de début : <strong>{
                        `${startAt.getDate()}/${startAt.getMonth()+1}/${startAt.getFullYear()} à ${startAt.getHours() < 10 ? '0' + startAt.getHours() : startAt.getHours()}h${startAt.getMinutes() < 10 ? '0' + startAt.getMinutes() : startAt.getMinutes()}`
                    }</strong></p>
                )}
                {bet.endAt && (
                    <p className="m-0">Date de fin : <strong>{
                        `${endAt.getDate()}/${endAt.getMonth()+1}/${endAt.getFullYear()} à ${endAt.getHours() < 10 ? '0' + endAt.getHours() : endAt.getHours()}h${endAt.getMinutes() < 10 ? '0' + endAt.getMinutes() : endAt.getMinutes()}`
                    }</strong></p>
                )}
                {bet.videogame && (
                    <p className="m-0">Jeu vidéo : <strong>{bet.videogame.name}</strong></p>
                )}
            </Col>
            <Col className="my-2" xs={12}>
                <Row>
                    <Col sm={5} xs={6} className="d-flex justify-content-center align-items-center">
                        <Image
                            rounded={true}
                            src={firstOpponent.image_url ?? 'https://c.tenor.com/_9Fx5W2D0ZkAAAAC/tiens-tiens-tiens-tiens.gif'}
                            className={styles.imgHeight}
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
            <Col className="mb-2" xs={12}>
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
                            className={styles.imgHeight}
                        />
                    </Col>
                </Row>
            </Col>
            <Col xs={12}>
                {(bet && betOn) && (
                    <div className="text-center">
                        <h3 className="my-1">Vous avez parié pour <strong>{betOn.opponent.name}</strong></h3>
                    </div>
                )}
                {'won' === bet.status && (
                    <div className="text-center">
                        <h3 className="my-1 text-success">Pari gagné (+{bet.amount} jetons)</h3>
                    </div>
                )}
                {'lost' === bet.status && (
                    <div className="text-center">
                        <h3 className="my-1 text-danger">Pari perdu (-{bet.amount} jetons)</h3>
                    </div>
                )}
                {('draw' === bet.status) && (
                    <div className="text-center">
                        <h3 className="my-1 text-muted">Match nul ({bet.amount} jetons remboursés)</h3>
                    </div>
                )}
                {('canceled' === bet.status) && (
                    <div className="text-center">
                        <h3 className="my-1 text-muted">Match annulé ({bet.amount} jetons remboursés)</h3>
                    </div>
                )}
                {(!bet.status && now < startAt) && (
                    <React.Fragment>
                        <Button className="my-2 w-100" variant="outline-warning" onClick={() => setShow(true)}>
                            Modifier le pari
                        </Button>
                        <BetModal
                            user={user}
                            match={match}
                            matchBet={bet}
                            show={show}
                            handleClose={() => setShow(false)}
                            onBet={onBet}
                        />
                    </React.Fragment>
                )}
            </Col>
        </Row>
    );
}
