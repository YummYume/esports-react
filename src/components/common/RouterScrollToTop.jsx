import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouterScrollToTop() {
    const location = useLocation();

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return null;
}
