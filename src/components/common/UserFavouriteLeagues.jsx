import React, { useState, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

import { getFavouriteLeagues } from '../../api/user';
import FavouriteButton from '../leagues/FavouriteButton';

export default function UserFavouriteLeagues({user, show, handleClose}) {
    const [loading, setLoading] = useState(true);
    const [favourites, setFavourites] = useState([]);

    const updateFavorites = async () => {
        setLoading(true);

        getFavouriteLeagues(user).then((data) => {
            setFavourites(data);
        }).catch((error) => {
            console.error(`Error during useEffect (UserFavouriteLeagues) : ${error}`);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        updateFavorites();
    }, []);

    return (
        <Offcanvas show={show} onHide={handleClose} placement="start" className="text-white">
            <Offcanvas.Header closeButton={true} closeVariant="white" closeLabel="Fermer">
                <Offcanvas.Title><h2>Vos ligues favorites</h2></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Row>
                    <Col xs={12}>
                        {!loading && (
                            favourites.map(favourite => {
                                return (
                                    <Row key={favourite.user_id + favourite.league_id} className="mb-4">
                                        <Col xs={12} className="text-center mb-1">
                                            <h3>{favourite.league_name}</h3>
                                        </Col>
                                        <Col xs={12}>
                                            <Image
                                                rounded={true}
                                                src={favourite.league_picture ?? 'https://c.tenor.com/ETlOjJ8aU7EAAAAC/za-warudo-jojo-bizarre-adventure.gif'}
                                                className="w-100"
                                            />
                                        </Col>
                                        <Col className="mt-2" xs={12}>
                                            <FavouriteButton
                                                user={user}
                                                league={{
                                                    id: favourite.league_id,
                                                    name: favourite.league_name,
                                                    image_url: favourite.league_picture
                                                }}
                                                onClick={updateFavorites}
                                            />
                                        </Col>
                                    </Row>
                                )
                            }).reduce((accu, elem, index) => {
                                return accu === null ? [elem] : [...accu, <hr key={index} />, elem]
                            }, null)
                        )}
                        {loading && (
                            <Spinner />
                        )}
                    </Col>
                </Row>
            </Offcanvas.Body>
        </Offcanvas>
    )
}
