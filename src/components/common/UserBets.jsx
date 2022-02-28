import React, { useState, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import { getBets } from '../../api/user';
import BetButton from './BetButton';

export default function UserBets({user, show, handleClose, updateUser}) {
    const [loading, setLoading] = useState(true);
    const [bets, setBets] = useState([]);

    const updateBets = async () => {
        setLoading(true);

        getBets(user).then((data) => {
            setBets(data);
        }).catch((error) => {
            console.error(`Error during updateBets (UserBets) : ${error}`);
        }).finally(() => {
            setLoading(false);
        });
    };

    const onBet = async () => {
        updateBets();
        updateUser();
    };

    useEffect(() => {
        if (show) {
            updateUser();
            updateBets();
        }
    }, [show]);

    return (
        <Offcanvas show={show} onHide={handleClose} placement="start" className="text-white">
            <Offcanvas.Header closeButton={true} closeVariant="white" closeLabel="Fermer">
                <Offcanvas.Title><h2>Vos paris</h2></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Row>
                    <Col xs={12} className="text-center">
                        {!loading && (
                            bets.map(bet => <BetButton user={user} match={{opponents: bet.opponents}} bet={bet} onBet={onBet} key={bet.user_id + bet.match_id} />).reduce((accu, elem, index) => {
                                return accu === null ? [elem] : [...accu, <hr key={index} />, elem]
                            }, null)
                        )}
                        {loading && (
                            <Spinner animation="border" variant="light" />
                        )}
                    </Col>
                </Row>
            </Offcanvas.Body>
        </Offcanvas>
    )
}
