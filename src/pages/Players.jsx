import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';

import { getGamePlayers, isValidGame, getGameNameBySlug } from '../api/pandaScore';
import PlayerSkeleton from '../components/players/skeleton/PlayerSkeleton';
import PlayerItem from '../components/players/PlayerItem';
import styles from '../styles/App.module.scss';

export default function Players() {
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState(null);
    const [page, setPage] = useState(null);
    const [perPage, setPerPage] = useState(54);
    const { slug } = useParams();
    const [params] = useSearchParams();

    useEffect(() => {
        updatePage();
    }, []);

    useEffect(() => {
        if (page) {
            getGamePlayers(slug, page, perPage).then((data) => {
                setPlayers(data.data);
            }).catch((error) => {
                console.error(`Error during useEffect for page (Players) : ${error}`);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [page]);

    useEffect(() => {
        false === loading && (setLoading(true));
        updatePage();

        if (page) {
            getGamePlayers(slug, page, perPage).then((data) => {
                setPlayers(data.data);
            }).catch((error) => {
                console.error(`Error during useEffect for slug (Players) : ${error}`);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [slug]);

    const updatePage = () => {
        page && (setPage(null));

        if (params.get('page')) {
            try {
                setPage(parseInt(params.get('page')));
            } catch (error) {
                setPage(1);
            }
        } else {
            setPage(1);
        }
    };

    return (
        <Container className="align-items-center" fluid>
            <Row className={`${styles.minWdScreenTitle} justify-content-center my-2`}>
                <Col className="text-center my-3" xs={12}>
                    <h1>Les joueurs{isValidGame(slug) && (` de ${getGameNameBySlug(slug)}`)}</h1>
                </Col>
                <Col xxl={11} xl={11} lg={12} md={12} sm={12} xs={10}>
                    <Row className="justify-content-around my-2">
                        {loading && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(skeleton => (<PlayerSkeleton key={skeleton} />))}
                        {!loading && players.map(player => (<PlayerItem key={player.id} player={player} />))}
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
