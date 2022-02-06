import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import cardStyles from '../../../styles/LeagueCard.module.scss';

const TeamSkeleton = () => (
    <Col className="my-3" md={6} sm={12} xs={12}>
        <Card className={cardStyles.cardMinHeight}>
            <Card.Body>
                <Row className="h-100">
                    <Col xs={4}>
                        <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} className="h-100" />
                    </Col>
                    <Col xs={8}>
                        <Card.Title className="mt-2">
                            <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} />
                        </Card.Title>
                        <Card.Text>
                            <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={5} />
                        </Card.Text>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    </Col>
);

export default TeamSkeleton;
