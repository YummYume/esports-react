import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

import cardStyles from '../../styles/ItemCard.module.scss';

const ItemItem = ({item}) => {
    return (
        <Col className="my-3" xxl={1} xl={2} lg={3} md={3} sm={4} xs={6}>
            <Card text="light" bg="dark" border="light" className={cardStyles.cardMinHeight}>
                <Card.Img className={cardStyles.imgHeight} variant="top" src={item.image_url ?? 'https://c.tenor.com/788bIjpR5hkAAAAC/anime.gif'} />
                <Card.Body>
                    <Card.Title>{item.name ?? 'Inconnu'}</Card.Title>
                    {(item.gold_total) && (
                        <Card.Text as="div">
                            {item.gold_total && (
                                <p className="m-0">Prix : <strong>{item.gold_total}</strong></p>
                            )}
                        </Card.Text>
                    )}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ItemItem;
