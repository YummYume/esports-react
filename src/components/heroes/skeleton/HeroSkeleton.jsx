import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import cardStyles from '../../../styles/HeroCard.module.scss';

const HeroSkeleton = () => (
    <Col className="my-3" xxl={2} xl={4} lg={4} md={5} sm={6} xs={11}>
        <Card text="light" bg="dark" border="light" className={cardStyles.cardMinHeight}>
            <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} height={150} />
            <Card.Body>
                <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} />
            </Card.Body>
        </Card>
    </Col>
);

export default HeroSkeleton;
