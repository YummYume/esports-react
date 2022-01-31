import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size';

import { getGamePlayers, isValidGame, getGameNameBySlug } from '../api/pandaScore';
import PlayerSkeleton from '../components/players/skeleton/PlayerSkeleton';
import PlayerItem from '../components/players/PlayerItem';
import styles from '../styles/App.module.scss';
import Pagination from '../components/common/Pagination';

export default function Players() {
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState(null);
    const [page, setPage] = useState(null);
    const [perPage, setPerPage] = useState(null);
    const [maxResults, setMaxResults] = useState(null);
    const { slug } = useParams();
    const [params] = useSearchParams();
    const width = useWindowWidth();

    useEffect(() => {
        updatePage();
        page && (updatePlayers());
    }, [slug, page, perPage]);

    useEffect(() => {
        updatePage();
    }, [params]);

    useEffect(() => {
        width < 500 && perPage !== 20 && (setPerPage(20));
        width >= 500 && width < 1000 && perPage !== 40 && (setPerPage(40));
        width >= 1000 && perPage !== 60 && (setPerPage(60));
    }, [width]);

    const updatePage = () => {
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

    const updatePlayers = () => {
        false === loading && (setLoading(true));

        getGamePlayers(slug, page, perPage).then((data) => {
            try {
                setMaxResults(parseInt(data.headers['x-total']));
            } catch (error) {
                console.error(`Error during updatePlayers (Players) : ${error}`);
                setMaxResults(null);
            }
            setPlayers(data.data);
        }).catch((error) => {
            console.error(`Error during updatePlayers (Players) : ${error}`);
        }).finally(() => {
            setLoading(false);
        });
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
                {page && perPage && maxResults && (
                    <Col className="my-4" xs={12}>
                        <div className="d-flex align-items-center justify-content-center">
                            <Pagination page={page} perPage={perPage} maxResults={maxResults} />
                        </div>
                    </Col>
                )}
            </Row>
        </Container>
    )
}
