import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import ReactCountryFlag from "react-country-flag";
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';

import cardStyles from '../../styles/TeamCard.module.scss';

const TeamItem = ({team}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
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
                            <Row className="h-100">
                                <Col xs={12}>
                                    <Card.Title className="mt-2">
                                        {team.name}
                                    </Card.Title>
                                </Col>
                                <Col xs={12}>
                                    <Card.Text as="div">
                                        {team.current_videogame && (
                                            <p className="m-0">Jeu vidéo : <strong>{team.current_videogame.name}</strong></p>
                                        )}
                                        {team.location && (
                                            <p className="m-0">Pays : <ReactCountryFlag countryCode={team.location} svg /> <strong>{team.location}</strong></p>
                                        )}
                                        <p className="m-0">Joueurs : <strong>{team.players.length}</strong></p>
                                    </Card.Text>
                                </Col>
                                <Col className="d-flex align-items-end" xs={12}>
                                    <Button className="my-1 mx-1 w-100" variant="outline-light" disabled={0 === team.players.length} onClick={handleShow}>Voir les joueurs</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Offcanvas show={show} onHide={handleClose} placement="end" className="text-white">
                <Offcanvas.Header closeButton={true} closeVariant="white" closeLabel="Fermer">
                    <Offcanvas.Title><h2>Les joueurs de la team {team.name} ({team.players.length})</h2></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Row>
                        <Col xs={12}>
                            {team.players.map(player => {
                                return (
                                    <Row key={player.id} className="mb-4">
                                        <Col xs={12} className="text-center mb-1">
                                            <h3>{player.name ?? 'Inconnu'}</h3>
                                        </Col>
                                        <Col xs={5}>
                                            <Image rounded={true} className={`w-100 ${cardStyles.canvasImgHeight}`} src={player.image_url ?? 'https://c.tenor.com/KjUtiyx4GhwAAAAC/wide-vladimir-putin.gif'} />
                                        </Col>
                                        <Col xs={7}>
                                            {player.role && (
                                                <p className="m-0">Role : <strong>{player.role}</strong></p>
                                            )}
                                            {player.nationality && (
                                                <p className="m-0">Nationalité : <ReactCountryFlag countryCode={player.nationality} svg /> <strong>{player.nationality}</strong></p>
                                            )}
                                        </Col>
                                    </Row>
                                )
                            }).reduce((accu, elem) => {
                                return accu === null ? [elem] : [...accu, <hr key={elem.key - 1} />, elem]
                            }, null)}
                        </Col>
                    </Row>
                </Offcanvas.Body>
            </Offcanvas>
        </Col>
    );
};

export default TeamItem;
