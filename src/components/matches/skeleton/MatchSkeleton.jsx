import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import cardStyles from '../../../styles/MatchCard.module.scss';

const MatchSkeleton = () => (
    <Col className="my-3" xl={6} xs={12}>
        <Card text="light" bg="dark" border="light" className={cardStyles.cardMinHeight}>
            <Card.Body>
                <Row className="h-100">
                    <Col className="mb-2" xs={12}>
                        <Card.Title className="mt-2 text-center">
                            <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} />
                        </Card.Title>
                        <Card.Text as="div">
                            <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={5} />
                        </Card.Text>
                    </Col>
                    <Col sm={6} xs={12}>
                        <Row>
                            <Col sm={5} xs={6} className="d-flex justify-content-center align-items-center">
                                <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} height={150} containerClassName="w-100" />
                            </Col>
                            <Col className="text-start" sm={7} xs={6}>
                                <Card.Title className="mt-2">
                                    <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} />
                                </Card.Title>
                                <Card.Text as="div">
                                    <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={3} />
                                </Card.Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={6} xs={12}>
                        <Row>
                            <Col className="text-end" sm={7} xs={6}>
                                <Card.Title className="mt-2">
                                    <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} />
                                </Card.Title>
                                <Card.Text as="div">
                                    <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={3} />
                                </Card.Text>
                            </Col>
                            <Col sm={5} xs={6} className="d-flex justify-content-center align-items-center">
                                <Skeleton baseColor="#6c757d" highlightColor="#97999b" count={1} height={150} containerClassName="w-100" />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    </Col>
);

export default MatchSkeleton;
