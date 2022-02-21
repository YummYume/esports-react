import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size';

import { getGameItems, isValidGame, getGameNameBySlug } from '../api/pandaScore';
import ItemSkeleton from '../components/items/skeleton/ItemSkeleton';
import ItemItem from '../components/items/ItemItem';
import styles from '../styles/App.module.scss';
import Pagination from '../components/common/Pagination';

export default function Items() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(null);
    const [perPage, setPerPage] = useState(null);
    const [maxResults, setMaxResults] = useState(null);
    const { slug } = useParams();
    const [params] = useSearchParams();
    const width = useWindowWidth();

    useEffect(() => {
        updatePage();
        page && (updateItems());
    }, [slug, page, perPage]);

    useEffect(() => {
        updatePage();
    }, [params]);

    useEffect(() => {
        width < 575 && perPage !== 40 && (setPerPage(40));
        width >= 575 && width < 1000 && perPage !== 60 && (setPerPage(60));
        width >= 1000 && perPage !== 84 && (setPerPage(84));
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

    const updateItems = () => {
        false === loading && (setLoading(true));

        getGameItems(slug, page, perPage).then((data) => {
            try {
                setItems(data ? data.data ?? [] : []);
                setMaxResults(parseInt(data.headers['x-total']));
            } catch (error) {
                console.error(`Error during getGameItems (Items) : ${error}`);
                setMaxResults(null);
            }
        }).catch((error) => {
            console.error(`Error during getGameItems (Items) : ${error}`);
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <Container className="align-items-center" fluid>
            <Row className={`${styles.minWdScreenTitle} justify-content-center my-2`}>
                <Col className="text-center my-3" xs={12}>
                    <h1>Les items{isValidGame(slug, true) && (` de ${getGameNameBySlug(slug)}`)}</h1>
                </Col>
                <Col xxl={11} xl={11} lg={11} md={11} sm={12} xs={10}>
                    <Row className="justify-content-around my-2">
                        {loading && [...Array(40).keys()].map(skeleton => (<ItemSkeleton key={skeleton} />))}
                        {!loading && items.map(item => (<ItemItem key={item.id} item={item} />))}
                        {!loading && items.length < 1 && (
                            <div className="text-center">
                                <h2>Aucun item trouvé. :(</h2>
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
