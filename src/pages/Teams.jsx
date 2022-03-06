import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { isValidGame, getGameNameBySlug, getGameTeams } from '../api/pandaScore';
import TeamSkeleton from '../components/teams/skeleton/TeamSkeleton';
import TeamItem from '../components/teams/TeamItem';
import Pagination from '../components/common/Pagination';

import styles from '../styles/App.module.scss';

export default function Teams() {
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState([]);
    const [page, setPage] = useState(null);
    const [perPage, setPerPage] = useState(null);
    const [maxResults, setMaxResults] = useState(null);
    const { slug } = useParams();
    const [params] = useSearchParams();
    const width = useWindowWidth();
    const [form, setForm] = useState({
        search: '',
    });

    useEffect(() => {
        updatePage();
        page && (updateTeams());
    }, [slug, page, perPage]);

    useEffect(() => {
        updatePage();
    }, [params]);

    useEffect(() => {
        width < 575 && perPage !== 20 && (setPerPage(20));
        width >= 575 && width < 1000 && perPage !== 40 && (setPerPage(40));
        width >= 1000 && perPage !== 60 && (setPerPage(60));
    }, [width]);

    useEffect(() => {
        maxResults && (setPage(Math.max(1, Math.min(page, Math.ceil(maxResults / perPage)))));
    }, [maxResults]);

    const updatePage = () => {
        if (params.get('page')) {
            try {
                const lastPage = Math.ceil(maxResults / perPage);

                parseInt(params.get('page')) <= lastPage ? setPage(parseInt(params.get('page'))) : setPage(lastPage);
            } catch (error) {
                console.error(`Error during updatePage (Teams) : ${error}`);
                setPage(1);
            }
        } else {
            setPage(1);
        }
    };

    const updateTeams = () => {
        false === loading && (setLoading(true));

        getGameTeams(slug, page, perPage, form.search).then((data) => {
            try {
                setTeams(data ? data.data ?? [] : []);
                setMaxResults(parseInt(data.headers['x-total']));
            } catch (error) {
                console.error(`Error during updateTeams (Teams) : ${error}`);
                setMaxResults(null);
            }
        }).catch((error) => {
            console.error(`Error during updateTeams (Teams) : ${error}`);
        }).finally(() => {
            setLoading(false);
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        !loading && (updateTeams());
    };

    const handleUserInput = (field, value) => {
        setForm((form) => {
            return {
                ...form,
                [field]: value
            }
        });
    };

    return (
        <Container className="align-items-center" fluid>
            <Row className={`${styles.minWdScreenTitle} justify-content-center my-2`}>
                <Col className="text-center my-3" xs={12}>
                    <h1>Les équipes{isValidGame(slug) && (` de ${getGameNameBySlug(slug)}`)}</h1>
                </Col>
                <Col className="mt-5" xs={12}>
                    <Row className={`justify-content-center my-2`}>
                        <Col xxl={4} lg={6} md={7} sm={8} xs={12}>
                            <Form noValidate onSubmit={onSubmit}>
                                <Form.Group className="mb-4" controlId="search">
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            value={form.search}
                                            placeholder="Rechercher"
                                            onInput={(e) => handleUserInput('search', e.target.value)}
                                        />
                                        <Button type="submit" disabled={loading} variant="outline-light">Rechercher</Button>
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Col>
                {(0 < page && 0 < perPage && 0 < maxResults) && (
                    <Col className="my-4" xs={12}>
                        <div className="d-flex align-items-center justify-content-center">
                            <Pagination page={page} perPage={perPage} maxResults={maxResults} loading={loading} />
                        </div>
                    </Col>
                )}
                <Col xxl={11} xl={11} lg={11} md={11} sm={12} xs={10}>
                    <Row className="justify-content-around my-2">
                        {loading && [...Array(20).keys()].map(skeleton => (<TeamSkeleton key={skeleton} />))}
                        {!loading && teams.map(team => (<TeamItem key={team.id} team={team} />))}
                        {!loading && teams.length < 1 && (
                            <div className="text-center">
                                <h2>Aucune équipe trouvée. :(</h2>
                            </div>
                        )}
                    </Row>
                </Col>
                {(0 < page && 0 < perPage && 0 < maxResults) && (
                    <Col className="my-4" xs={12}>
                        <div className="d-flex align-items-center justify-content-center">
                            <Pagination page={page} perPage={perPage} maxResults={maxResults} loading={loading} />
                        </div>
                    </Col>
                )}
            </Row>
        </Container>
    )
}
