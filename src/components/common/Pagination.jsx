import React, { useState, useEffect } from 'react';
import BPagination from 'react-bootstrap/Pagination';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size';

export default function Pagination({page, perPage, maxResults, loading}) {
    const [lastPage, setLastPage] = useState(0);
    const width = useWindowWidth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setLastPage(Math.ceil(maxResults / perPage));
    }, [perPage, maxResults]);

    return (
        <BPagination size={width < 500 ? "sm" : width >= 1000 ? "lg" : ""}>
            <BPagination.First
                disabled={page <= 1 || loading}
                onClick={() => {
                    page - 10 <= 1 ? navigate(`${location.pathname}?page=${1}`) : navigate(`${location.pathname}?page=${page - 10}`)
                }}
            />
            <BPagination.Prev disabled={page <= 1 || loading} onClick={() => navigate(`${location.pathname}?page=${page - 1}`)} />
            {page >= 4 && (
                <BPagination.Item disabled={loading} onClick={() => navigate(`${location.pathname}?page=${1}`)}>{1}</BPagination.Item>
            )}
            {page >= 5 && (
                <BPagination.Ellipsis disabled />
            )}
            {page - 2 >= 1 && (
                <BPagination.Item disabled={loading} onClick={() => navigate(`${location.pathname}?page=${page - 2}`)}>{page - 2}</BPagination.Item>
            )}
            {page - 1 >= 1 && (
                <BPagination.Item disabled={loading} onClick={() => navigate(`${location.pathname}?page=${page - 1}`)}>{page - 1}</BPagination.Item>
            )}
            <BPagination.Item active>{page}</BPagination.Item>
            {page + 1 <= lastPage && (
                <BPagination.Item disabled={loading} onClick={() => navigate(`${location.pathname}?page=${page + 1}`)}>{page + 1}</BPagination.Item>
            )}
            {page + 2 <= lastPage && (
                <BPagination.Item disabled={loading} onClick={() => navigate(`${location.pathname}?page=${page + 2}`)}>{page + 2}</BPagination.Item>
            )}
            {page + 5 <= lastPage && (
                <BPagination.Ellipsis disabled />
            )}
            {page + 4 <= lastPage && (
                <BPagination.Item disabled={loading} onClick={() => navigate(`${location.pathname}?page=${lastPage}`)}>{lastPage}</BPagination.Item>
            )}
            <BPagination.Next disabled={page >= lastPage || loading} onClick={() => navigate(`${location.pathname}?page=${page + 1}`)} />
            <BPagination.Last
                disabled={page >= lastPage || loading}
                onClick={() => {
                    page + 10 >= lastPage ? navigate(`${location.pathname}?page=${lastPage}`) : navigate(`${location.pathname}?page=${page + 10}`)
                }}
            />
        </BPagination>
    )
}
