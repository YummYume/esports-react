import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import cardStyles from '../../../styles/PlayerCard.module.scss';

const PlayerSkeleton = () => (
    <Col className="my-3" xxl={2} xl={3} md={4} sm={6} xs={12}>
        <Card bg="dark" className={cardStyles.cardMinHeight}>
            <Card.Body>
                <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} height={150} />
                <Card.Title className="mt-2">
                    <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} />
                </Card.Title>
                <Card.Text>
                    <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={4} />
                </Card.Text>
                <Skeleton baseColor="#6c757d" highlightColor="#97999b" className={cardStyles.iconPosition} circle={true} count={1} width={25} height={25} />
            </Card.Body>
        </Card>
    </Col>
);

export default PlayerSkeleton;
