import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import MainButtons from '../components/main/Buttons';
import styles from '../styles/App.module.scss';

export default function Main({user}) {
    return (
        <Container className="align-items-center" fluid>
            <Row className={`${styles.minWdScreenTitle} justify-content-center my-2`}>
                <Col className="text-center" xs={12}>
                    <h1 className={`${styles.mainTitle}`}>L'Esport,<br /> Plus qu'une Compétition,<br />Un Investissement.</h1>
                </Col>
            </Row>
            <MainButtons user={user} />
        </Container>
    );
}
