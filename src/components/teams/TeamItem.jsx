import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import ReactCountryFlag from "react-country-flag";

import cardStyles from '../../styles/TeamCard.module.scss';

const TeamItem = ({team}) => (
    <Col className="my-3" xxl={4} md={6} xs={12}>
        <Card text="light" bg="dark" border="light" className={cardStyles.cardMinHeight}>
            <Card.Body>
                <Row className="h-100">
                    <Col sm={5} xs={6} className="d-flex justify-content-center align-items-center">
                        <Image
                            rounded={true}
                            src={team.image_url ? team.image_url : 'https://c.tenor.com/_9Fx5W2D0ZkAAAAC/tiens-tiens-tiens-tiens.gif'}
                            className={cardStyles.imgHeight}
                        />
                    </Col>
                    <Col sm={7} xs={6}>
                        <Card.Title className="mt-2">
                            {team.name}
                        </Card.Title>
                        <Card.Text as="div">
                            {team.current_videogame && (
                                <p className="m-0">Jeux vidéo : <strong>{team.current_videogame.name}</strong></p>
                            )}
                            {team.location && (
                                <p className="m-0">Pays : <ReactCountryFlag countryCode={team.location} svg /> <strong>{team.location}</strong></p>
                            )}
                            <p className="m-0">Joueurs : <strong>{team.players.length}</strong></p>
                        </Card.Text>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    </Col>
);

export default TeamItem;
