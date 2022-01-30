import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { isLoggedIn } from '../api/user';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/App.module.scss';

export default function Menu({updateUser}) {
    const navigate = useNavigate();

    useEffect(() => {
        updateUser();

        isLoggedIn().then((loggedIn) => {
            if (!loggedIn) {
                navigate('/');
            }
        }).catch((error) => {
            console.error(`Error during useEffect (Menu) : ${error}`);
        });
    }, []);

    return (
        <Container className="align-items-center" fluid>
            <Row className={`${styles.minWdScreenTitle} justify-content-center my-2`}>
                <Col className="text-center" xs={12}>
                    <h1>Les derniers matchs</h1>
                </Col>
            </Row>
        </Container>
    )
}
