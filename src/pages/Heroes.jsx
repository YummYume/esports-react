import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size';

import { getGameHeroes, isValidGame, getGameNameBySlug } from '../api/pandaScore';
import HeroSkeleton from '../components/heroes/skeleton/HeroSkeleton';
import HeroItem from '../components/heroes/HeroItem';
import styles from '../styles/App.module.scss';
import Pagination from '../components/common/Pagination';

export default function Heroes() {
    const [loading, setLoading] = useState(true);
    const [heroes, setHeroes] = useState([]);
    const [page, setPage] = useState(null);
    const [perPage, setPerPage] = useState(null);
    const [maxResults, setMaxResults] = useState(null);
    const { slug } = useParams();
    const [params] = useSearchParams();
    const width = useWindowWidth();

    useEffect(() => {
        updatePage();
        page && (updateHeroes());
    }, [slug, page, perPage]);

    useEffect(() => {
        updatePage();
    }, [params]);

    useEffect(() => {
        width < 575 && perPage !== 20 && (setPerPage(20));
        width >= 575 && width < 1000 && perPage !== 40 && (setPerPage(40));
        width >= 1000 && perPage !== 60 && (setPerPage(60));
    }, [width]);

    const updatePage = () => {
        if (params.get('page')) {
            try {
                const lastPage = Math.ceil(maxResults / perPage);

                parseInt(params.get('page')) <= lastPage ? setPage(parseInt(params.get('page'))) : setPage(lastPage);
            } catch (error) {
                setPage(1);
            }
        } else {
            setPage(1);
        }
    };

    const updateHeroes = () => {
        false === loading && (setLoading(true));

        getGameHeroes(slug, page, perPage).then((data) => {
            try {
                setHeroes(data ? data.data ?? [] : []);
                setMaxResults(parseInt(data.headers['x-total']));
            } catch (error) {
                console.error(`Error during updateHeroes (Heroes) : ${error}`);
                setMaxResults(null);
            }
        }).catch((error) => {
            console.error(`Error during updateHeroes (Heroes) : ${error}`);
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <Container className="align-items-center" fluid>
            <Row className={`${styles.minWdScreenTitle} justify-content-center my-2`}>
                <Col className="text-center my-3" xs={12}>
                    <h1>Les personnages{isValidGame(slug, true) && (` de ${getGameNameBySlug(slug)}`)}</h1>
                </Col>
                <Col xxl={11} xl={11} lg={11} md={11} sm={12} xs={10}>
                    <Row className="justify-content-around my-2">
                        {loading && [...Array(20).keys()].map(skeleton => (<HeroSkeleton key={skeleton} />))}
                        {!loading && heroes.map(hero => (<HeroItem key={hero.id} hero={hero} />))}
                        {!loading && heroes.length < 1 && (
                            <div className="text-center">
                                <h2>Aucun personnage trouvé. :(</h2>
                            </div>
                        )}
                    </Row>
                </Col>
                {(0 < page && 0 < perPage && 0 < maxResults) && (
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
