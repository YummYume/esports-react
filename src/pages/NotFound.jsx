import React from 'react';
import Button from 'react-bootstrap/Button';
import { Row, Col, Container } from 'react-bootstrap';
import { UWU } from 'react-uwu';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/App.module.scss';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <Container className="align-items-center" fluid>
            <Row className={`${styles.minWdScreenTitle} justify-content-center my-2`}>
                <Col className="text-center" xs={12}>
                    <h1><UWU>Cette page n'existe pas. C'est vraiment dommage...</UWU></h1>
                </Col>
                <Col className="text-center" xs={12}>
                    <Button size="lg" variant="outline-dark" onClick={() => navigate('/')}>Accueil</Button>
                </Col>
            </Row>
        </Container>
    )
}
