import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useSpring, animated } from 'react-spring';

import MainButtons from '../components/main/Buttons';

import styles from '../styles/App.module.scss';

export default function Main({user}) {
    const titleProps = useSpring({
        to: { opacity: 1 },
        from: { opacity: 0 },
        delay: 200,
        config: {
            duration: 2000,
        },
    });

    return (
        <Container className="align-items-center" fluid>
            <Row className={`${styles.minWdScreenTitle} justify-content-center my-2`}>
                <Col className="text-center" xs={12}>
                    <animated.h1 style={titleProps} className={`${styles.mainTitle}`}>L'Esport,<br /> Plus qu'une Compétition,<br />Un Investissement.</animated.h1>
                </Col>
            </Row>
            <MainButtons user={user} />
        </Container>
    );
}
