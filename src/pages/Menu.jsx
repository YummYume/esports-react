import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { isLoggedIn } from '../api/user';
import { getGameMatches } from '../api/pandaScore';
import MatchSkeleton from '../components/matches/skeleton/MatchSkeleton';
import MatchItem from '../components/matches/MatchItem';

import styles from '../styles/App.module.scss';

export default function Menu({user, updateUser}) {
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        updateUser();

        isLoggedIn().then((loggedIn) => {
            if (!loggedIn) {
                navigate('/');
            }
            updateMatches();
        }).catch((error) => {
            console.error(`Error during useEffect (Menu) : ${error}`);
        });
    }, []);

    const updateMatches = () => {
        false === loading && (setLoading(true));

        getGameMatches('past', 'all', 1, 10).then((data) => {
            try {
                setMatches(data ? data.data ?? [] : []);
            } catch (error) {
                console.error(`Error during updateMatches (Menu) : ${error}`);
            }
        }).catch((error) => {
            console.error(`Error during updateMatches (Menu) : ${error}`);
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <Container className="align-items-center" fluid>
            <Row className={`${styles.minWdScreenTitle} justify-content-center my-2`}>
                <Col className="text-center my-3" xs={12}>
                <h1>Les derniers matchs</h1>
                </Col>
                <Col xxl={11} xl={11} lg={11} md={11} sm={12} xs={10}>
                    <Row className="justify-content-around my-2">
                        {loading && [...Array(4).keys()].map(skeleton => (<MatchSkeleton key={skeleton} />))}
                        {!loading && matches.map(match => match.opponents.length > 1 && (
                            <MatchItem key={match.id} match={match} endpoint='past' user={user} updateUser={updateUser} />
                        ))}
                        {!loading && matches.length < 1 && (
                            <div className="text-center">
                                <h2>Aucun match trouvé. :(</h2>
                            </div>
                        )}
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
