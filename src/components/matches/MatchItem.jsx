import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import ReactCountryFlag from "react-country-flag";

import cardStyles from '../../styles/MatchCard.module.scss';

const MatchItem = ({match}) => {
    let firstOpponent = match.opponents[0].opponent;
    let secondOpponent = match.opponents[1].opponent;

    firstOpponent = {...firstOpponent, ...match.results.find(team => team.id === firstOpponent.id)};
    secondOpponent = {...secondOpponent, ...match.results.find(team => team.id === secondOpponent.id)};

    return (
        <Col className="my-3" lg={6} xs={12}>
            <Card text="light" bg="dark" border="light" className={cardStyles.cardMinHeight}>
                <Card.Body>
                    <Row className="h-100">
                        <Col xs={12}>
                            <Card.Title className="mt-2 text-center">
                                {firstOpponent.name} contre {secondOpponent.name}
                            </Card.Title>
                            <Card.Text as="div">

                            </Card.Text>
                        </Col>
                        <Col sm={6} xs={12}>
                            <Row>
                                <Col sm={5} xs={6} className="d-flex justify-content-center align-items-center">
                                    <Image
                                        rounded={true}
                                        src={firstOpponent.image_url ?? 'https://c.tenor.com/_9Fx5W2D0ZkAAAAC/tiens-tiens-tiens-tiens.gif'}
                                        className={cardStyles.imgHeight}
                                    />
                                </Col>
                                <Col sm={7} xs={6}>
                                    <Card.Title className="mt-2">
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
                        <Col sm={6} xs={12}>
                            <Row>
                                <Col className="text-end" sm={7} xs={6}>
                                    <Card.Title className="mt-2">
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
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default MatchItem;
