import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

import cardStyles from '../../styles/HeroCard.module.scss';

const HeroItem = ({hero}) => {
    return (
        <Col className="my-3" xxl={2} xl={4} lg={4} md={5} sm={6} xs={11}>
            <Card text="light" bg="dark" border="light" className={cardStyles.cardMinHeight}>
                <Card.Img className={cardStyles.imgHeight} variant="top" src={
                    hero.big_image_url ? hero.big_image_url
                    : hero.image_url ? hero.image_url
                    : 'Marci' === hero.localized_name ? '/images/marci.png'
                    : 'Primal Beast' === hero.localized_name ? '/images/primal_beast.png'
                    : 'https://i.imgflip.com/slxyb.jpg'
                } />
                <Card.Body>
                    <Card.Title>{hero.localized_name ?? hero.name ?? 'Inconnu'}</Card.Title>
                    {(hero.armor || hero.attackdamage || hero.mp || hero.attackrange || hero.hp || hero.movespeed) && (
                        <Card.Text as="div">
                            {hero.armor && (
                                <p className="m-0">Armure : <strong>{hero.armor}</strong></p>
                            )}
                            {hero.attackdamage && (
                                <p className="m-0">Puissance physique : <strong>{hero.attackdamage}</strong></p>
                            )}
                            {(null !== hero.mp && undefined !== hero.mp) && (
                                <p className="m-0">Puissance magique : <strong>{hero.mp}</strong></p>
                            )}
                            {hero.attackrange && (
                                <p className="m-0">Portée d'attaque : <strong>{hero.attackrange}</strong></p>
                            )}
                            {hero.hp && (
                                <p className="m-0">Points de vie : <strong>{hero.hp}</strong></p>
                            )}
                            {hero.movespeed && (
                                <p className="m-0">Vitesse de déplacement : <strong>{hero.movespeed}</strong></p>
                            )}
                        </Card.Text>
                    )}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default HeroItem;
