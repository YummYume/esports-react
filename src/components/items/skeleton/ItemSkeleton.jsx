import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import cardStyles from '../../../styles/ItemCard.module.scss';

const ItemSkeleton = () => (
    <Col className="my-3" xxl={1} xl={2} lg={3} md={3} sm={4} xs={6}>
        <Card text="light" bg="dark" border="light" className={cardStyles.cardMinHeight}>
            <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} height={150} />
            <Card.Body>
                <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} />
            </Card.Body>
        </Card>
    </Col>
);

export default ItemSkeleton;
