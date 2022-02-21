import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { isValidGame, getGameNameBySlug, getGameMatches } from '../api/pandaScore';
import MatchSkeleton from '../components/matches/skeleton/MatchSkeleton';
import MatchItem from '../components/matches/MatchItem';
import Pagination from '../components/common/Pagination';

import styles from '../styles/App.module.scss';

export default function Matches() {
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const [page, setPage] = useState(null);
    const [perPage, setPerPage] = useState(null);
    const [maxResults, setMaxResults] = useState(null);
    const { slug, endpoint } = useParams();
    const [params] = useSearchParams();
    const width = useWindowWidth();
    const navigate = useNavigate();

    useEffect(() => {
        updatePage();
        page && (updateMatches());
    }, [slug, endpoint, page, perPage]);

    useEffect(() => {
        updatePage();
    }, [params]);

    useEffect(() => {
        width < 992 && perPage !== 20 && (setPerPage(20));
        width >= 992 && perPage !== 40 && (setPerPage(40));
    }, [width]);

    const updatePage = () => {
        if (params.get('page')) {
            try {
                const lastPage = Math.ceil(maxResults / perPage);

                parseInt(params.get('page')) <= lastPage ? setPage(parseInt(params.get('page'))) : setPage(lastPage);
            } catch (error) {
                console.error(`Error during updatePage (Matches) : ${error}`);
                setPage(1);
            }
        } else {
            setPage(1);
        }
    };

    const updateMatches = () => {
        false === loading && (setLoading(true));

        getGameMatches(endpoint, slug, page, perPage).then((data) => {
            try {
                setMatches(data ? data.data ?? [] : []);
                setMaxResults(parseInt(data.headers['x-total']));
            } catch (error) {
                console.error(`Error during updateMatches (Matches) : ${error}`);
                setMaxResults(null);
            }
        }).catch((error) => {
            console.error(`Error during updateMatches (Matches) : ${error}`);
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <Container className="align-items-center" fluid>
            <Row className={`${styles.minWdScreenTitle} justify-content-center my-2`}>
                <Col className="text-center my-3" xs={12}>
                    <h1>Les matchs{isValidGame(slug) && (` ${getGameNameBySlug(slug)}`)}</h1>
                </Col>
                <Col xxl={4} lg={6} md={7} sm={8} xs={12}>
                    <ButtonGroup className="w-100">
                        <Button variant="outline-light" className={'upcoming' === endpoint ? 'active' : ''} onClick={() => navigate(`/matches/${slug}/upcoming`)}>À venir</Button>
                        <Button variant="outline-light" className={'running' === endpoint ? 'active' : ''} onClick={() => navigate(`/matches/${slug}/running`)}>En cours</Button>
                        <Button variant="outline-light" className={'past' === endpoint ? 'active' : ''} onClick={() => navigate(`/matches/${slug}/past`)}>Passés</Button>
                    </ButtonGroup>
                </Col>
                <Col xxl={11} xl={11} lg={11} md={11} sm={12} xs={10}>
                    <Row className="justify-content-around my-2">
                        {loading && [...Array(20).keys()].map(skeleton => (<MatchSkeleton key={skeleton} />))}
                        {!loading && matches.map(match => match.opponents.length > 1 && (<MatchItem key={match.id} match={match} />))}
                        {!loading && matches.length < 1 && (
                            <div className="text-center">
                                <h2>Aucun match trouvé. :(</h2>
                            </div>
                        )}
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
