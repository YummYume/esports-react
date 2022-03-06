import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import cardStyles from '../../../styles/LeagueCard.module.scss';

const LeagueSkeleton = () => (
    <Col className="my-3" xxl={3} xl={4} md={6} sm={12} xs={12}>
        <Card text="light" bg="dark" border="light" className={cardStyles.cardMinHeight}>
            <Card.Body className="d-flex">
                <Row className="w-100 m-auto">
                    <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} height={250} />
                    <Col sm={6} xs={12}>
                        <Card.Title className="mt-2">
                            <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} />
                        </Card.Title>
                        <Card.Text as="div">
                            <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={4} />
                        </Card.Text>
                    </Col>
                    <Col className="text-end d-flex align-items-center mt-sm-0 mt-2" sm={6} xs={12}>
                        <div className="w-100">
                            <Skeleton baseColor="#6c757d" highlightColor="#97999b" className="my-1 mx-1 w-100" count={1} width={25} height={25} />
                            <Skeleton baseColor="#6c757d" highlightColor="#97999b" className="my-1 mx-1 w-100" count={1} width={25} height={25} />
                            <Skeleton baseColor="#6c757d" highlightColor="#97999b" className="my-1 mx-1 w-100" count={1} width={25} height={25} />
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    </Col>
);

export default LeagueSkeleton;
