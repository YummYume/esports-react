import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import cardStyles from '../../styles/LeagueCard.module.scss';

const LeagueItem = ({league}) => {
    return (
        <Col className="my-3" xxl={4} md={6} sm={12} xs={12}>
            <Card text="info" bg="dark" border="info" className={cardStyles.cardMinHeight}>
                <Card.Img className={cardStyles.imgHeight} variant="top" src={league.image_url ?? 'https://c.tenor.com/ETlOjJ8aU7EAAAAC/za-warudo-jojo-bizarre-adventure.gif'} />
                <Card.Body>
                    <Row>
                        <Col sm={8} xs={12}>
                            <Card.Title className="mt-2">
                                {league.name}
                            </Card.Title>
                            <Card.Text>
                                {league.videogame && (
                                    <p className="m-0">Jeux vidéo : <strong>{league.videogame.name}</strong></p>
                                )}
                                <p className="m-0">Séries : <strong>{league.series.length}</strong></p>
                            </Card.Text>
                        </Col>
                        <Col className="text-end" sm={4} xs={12}>
                            <Button className="my-1 mx-1" variant="outline-info">Voir les séries</Button>
                            <Button className="my-1 mx-1" variant="outline-info">Voir les matchs</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default LeagueItem;
