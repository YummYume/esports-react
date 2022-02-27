import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';

import FavouriteButton from './FavouriteButton';

import cardStyles from '../../styles/LeagueCard.module.scss';

const LeagueItem = ({league, user}) => {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Col className="my-3" xxl={3} xl={4} md={6} sm={12} xs={12}>
            <Card text="light" bg="dark" border="light" className={cardStyles.cardMinHeight}>
                <Card.Img className={cardStyles.imgHeight} variant="top" src={league.image_url ?? 'https://c.tenor.com/ETlOjJ8aU7EAAAAC/za-warudo-jojo-bizarre-adventure.gif'} />
                <Card.Body className="d-flex">
                    <Row>
                        <Col sm={6} xs={12}>
                            <Card.Title className="mt-2">
                                {league.name}
                            </Card.Title>
                            <Card.Text as="div">
                                {league.videogame && (
                                    <p className="m-0">Jeux vidéo : <strong>{league.videogame.name}</strong></p>
                                )}
                                <p className="m-0">Séries : <strong>{league.series.length}</strong></p>
                            </Card.Text>
                        </Col>
                        <Col className="text-end d-flex align-items-center mt-sm-0 mt-2" sm={6} xs={12}>
                            <div className="w-100">
                                <Button className="my-1 mx-1 w-100" variant="outline-light" disabled={0 === league.series.length} onClick={handleShow}>Voir les séries</Button>
                                <Button className="my-1 mx-1 w-100" variant="outline-light" onClick={() => navigate(`/leagues/matches/${league.id}/upcoming`)}>Voir les matchs</Button>
                                <FavouriteButton user={user} league={league} />
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Offcanvas show={show} onHide={handleClose} placement="end" className="text-white">
                <Offcanvas.Header closeButton={true} closeVariant="white" closeLabel="Fermer">
                    <Offcanvas.Title><h2>Les séries de la league {league.name} ({league.series.length})</h2></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Row>
                        <Col xs={12}>
                            {league.series.map(serie => {
                                const begin_at = serie.begin_at ? new Date(serie.begin_at) : null;
                                const end_at = serie.end_at ? new Date(serie.end_at) : null;

                                return (
                                    <Row key={serie.id} className="mb-4">
                                        <Col xs={12} className="text-center mb-1">
                                            <h3>{serie.full_name ? serie.full_name : serie.name}</h3>
                                        </Col>
                                        <Col xs={12}>
                                            {serie.description && (
                                                <p className="m-0">Description : <strong>{serie.description}</strong></p>
                                            )}
                                            {serie.tier && (
                                                <p className="m-0">Tier : <strong>{serie.tier}</strong></p>
                                            )}
                                            {begin_at && (
                                                <p className="m-0">Commence le : <strong>{
                                                    `${begin_at.getDate()}/${begin_at.getMonth()+1}/${begin_at.getFullYear()}`
                                                }</strong></p>
                                            )}
                                            {end_at && (
                                                <p className="m-0">Termine le : <strong>{
                                                    `${end_at.getDate()}/${end_at.getMonth()+1}/${end_at.getFullYear()}`
                                                }</strong></p>
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

export default LeagueItem;
