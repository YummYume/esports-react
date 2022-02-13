import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ReactCardFlip from 'react-card-flip';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import ReactCountryFlag from "react-country-flag";

import cardStyles from '../../styles/PlayerCard.module.scss';

const PlayerItem = ({player}) => {
    const [flipped, setFlipped] = useState(false);

    const teamTooltip = (props) => (
        <Tooltip id={`team-tooltip-${player.id}`} {...props}>
            <Image className={cardStyles.tooltipDimensions} src={player.current_team.image_url} alt={`Team ${player.current_team.name} logo`} rounded />
        </Tooltip>
    );

    return (
        <Col className="my-3" xxl={2} xl={3} lg={3} md={4} sm={6} xs={11}>
            <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
                <Card text="light" bg="dark" border="light" className={cardStyles.cardMinHeight}>
                    <Card.Img className={cardStyles.imgHeight} variant="top" src={player.image_url ?? 'https://c.tenor.com/KjUtiyx4GhwAAAAC/wide-vladimir-putin.gif'} />
                    <Card.Body>
                        <Card.Title>{player.name ?? 'Inconnu'}</Card.Title>
                        {(player.name || player.last_name) && (
                            <Card.Text>
                                <strong>{`${player.name ?? ''}${player.last_name ? ' ' + player.last_name : ''}`}</strong>
                                {player.current_team ? ', de la team ' : '.'}
                                {player.current_team && (
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={teamTooltip}
                                    >
                                        <span><strong>{player.current_team.name}</strong>.</span>
                                    </OverlayTrigger>
                                )}
                            </Card.Text>
                        )}
                        <FaArrowRight size="1.5em" className={cardStyles.iconPosition} onClick={() => flipped ? setFlipped(false) : setFlipped(true)} />
                    </Card.Body>
                </Card>
                <Card text="light" bg="dark" border="light" className={cardStyles.cardMinHeight}>
                    <Card.Img className={cardStyles.imgHeight} variant="top" src={player.image_url ?? 'https://c.tenor.com/KjUtiyx4GhwAAAAC/wide-vladimir-putin.gif'} />
                    <Card.Body>
                        <Card.Title>{`${player.name ?? ''}${player.last_name ? ' ' + player.last_name : ''}`}</Card.Title>
                        {player.current_videogame && (
                            <p className="m-0">Jeux vidéo : <strong>{player.current_videogame.name}</strong></p>
                        )}
                        {player.current_team && (
                            <p className="m-0">Team :
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={teamTooltip}
                                >
                                    <span> <strong>{player.current_team.name}</strong></span>
                                </OverlayTrigger>
                            </p>
                        )}
                        {player.role && (
                            <p className="m-0">Role : <strong>{player.role}</strong></p>
                        )}
                        {player.nationality && (
                            <p className="m-0">Nationalité : <ReactCountryFlag countryCode={player.nationality} svg /> <strong>{player.nationality}</strong></p>
                        )}
                        <FaArrowLeft size="1.5em" className={cardStyles.iconPosition} onClick={() => flipped ? setFlipped(false) : setFlipped(true)} />
                    </Card.Body>
                </Card>
            </ReactCardFlip>
        </Col>
    );
};

export default PlayerItem;
