import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { getFavouriteLeague, addFavouriteLeague, removeFavouriteLeague } from '../../api/user';

const FavouriteButton = ({user, league, onClick = null}) => {
    const [loading, setLoading] = useState(true);
    const [favourite, setFavourite] = useState(null);

    useEffect(() => {
        setLoading(true);

        getFavouriteLeague(user, league).then((favourite) => {
            setFavourite(favourite);
        }).catch((error) => {
            console.error(`Error during useEffect (FavouriteButton) : ${error}`);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const addFavourite = async () => {
        setLoading(true);

        addFavouriteLeague(user, league).then((res) => {
            setFavourite(res);
            null !== onClick && (onClick());
        }).catch((error) => {
            console.error(`Error during addFavourite (FavouriteButton) : ${error}`);
        }).finally(() => {
            setLoading(false);
        });
    };

    const removeFavourite = async () => {
        setLoading(true);

        removeFavouriteLeague(favourite).then((res) => {
            setFavourite(res);
            null !== onClick && (onClick());
        }).catch((error) => {
            setFavourite(null);
            console.error(`Error during removeFavourite (FavouriteButton) : ${error}`);
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <Button className="my-1 mx-1 w-100" variant={`outline-${favourite ? 'warning' : 'success'}`} onClick={favourite ? removeFavourite : addFavourite} disabled={loading}>
            {favourite ? 'Supprimer des favoris' : 'Ajouter aux favoris'} {loading &&
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                >
                    <span className="visually-hidden">...</span>
                </Spinner>
            }
        </Button>
    );
};

export default FavouriteButton;
